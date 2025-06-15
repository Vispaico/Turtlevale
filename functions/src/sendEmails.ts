import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as sgMail from '@sendgrid/mail';

const db = admin.firestore();

// Initialize SendGrid
const config = functions.config();
const sendGridApiKey = config.sendgrid?.api_key;

if (sendGridApiKey) {
  sgMail.setApiKey(sendGridApiKey);
}

interface UserSubscription {
  email: string;
  userId: string;
  subscription: {
    type: 'free' | 'individual' | 'full-access';
    markets: string[];
    isActive: boolean;
  };
  displayName?: string;
}

interface TurtleSignal {
  ticker: string;
  market: string;
  action: 'BUY' | 'SELL';
  price: number;
  stopLoss?: number;
  target?: number;
  timestamp: admin.firestore.Timestamp;
}

export const sendDailySignals = functions.pubsub.schedule('5 22 * * *') // 5 minutes after signal generation
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('Starting email notification process');
    
    if (!sendGridApiKey) {
      console.error('SendGrid API key not configured');
      return;
    }

    try {
      // Get today's signals
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const signalsSnapshot = await db.collection('signals')
        .where('timestamp', '>=', admin.firestore.Timestamp.fromDate(today))
        .get();

      if (signalsSnapshot.empty) {
        console.log('No signals found for today');
        return;
      }

      const signals: TurtleSignal[] = signalsSnapshot.docs.map(doc => ({
        ...doc.data(),
        timestamp: doc.data().timestamp
      })) as TurtleSignal[];

      // Group signals by market
      const signalsByMarket = groupSignalsByMarket(signals);

      // Get all users with active subscriptions
      const usersSnapshot = await db.collection('users')
        .where('subscription.isActive', '==', true)
        .get();

      const users: UserSubscription[] = usersSnapshot.docs.map(doc => ({
        userId: doc.id,
        email: doc.data().email,
        subscription: doc.data().subscription,
        displayName: doc.data().displayName || doc.data().name
      }));

      // Send emails to qualified users
      for (const user of users) {
        try {
          await sendSignalEmail(user, signalsByMarket);
          console.log(`Email sent to ${user.email}`);
        } catch (error) {
          console.error(`Failed to send email to ${user.email}:`, error);
        }
      }

      console.log(`Email notifications process completed for ${users.length} users`);

    } catch (error) {
      console.error('Error in email notification process:', error);
      throw error;
    }
  });

function groupSignalsByMarket(signals: TurtleSignal[]): Record<string, TurtleSignal[]> {
  return signals.reduce((acc, signal) => {
    if (!acc[signal.market]) {
      acc[signal.market] = [];
    }
    acc[signal.market].push(signal);
    return acc;
  }, {} as Record<string, TurtleSignal[]>);
}

async function sendSignalEmail(user: UserSubscription, signalsByMarket: Record<string, TurtleSignal[]>): Promise<void> {
  const { subscription } = user;
  
  // Determine which markets user can access
  let accessibleMarkets: string[] = [];
  
  if (subscription.type === 'full-access') {
    accessibleMarkets = Object.keys(signalsByMarket);
  } else if (subscription.type === 'individual') {
    accessibleMarkets = subscription.markets.filter(market => signalsByMarket[market]);
  } else if (subscription.type === 'free') {
    // Free users get 1 market (first subscribed market with signals)
    const firstMarket = subscription.markets.find(market => signalsByMarket[market]);
    if (firstMarket) {
      accessibleMarkets = [firstMarket];
    }
  }

  if (accessibleMarkets.length === 0) {
    console.log(`No accessible signals for user ${user.email}`);
    return;
  }

  // Collect signals for accessible markets
  const userSignals: TurtleSignal[] = [];
  accessibleMarkets.forEach(market => {
    userSignals.push(...signalsByMarket[market]);
  });

  if (userSignals.length === 0) {
    return;
  }

  // Determine if email should be delayed (free users get 1-hour delay)
  const isDelayed = subscription.type === 'free';
  const delayMinutes = isDelayed ? 60 : 0;

  if (isDelayed) {
    // Schedule delayed email
    setTimeout(async () => {
      await sendEmailNow(user, userSignals, true);
    }, delayMinutes * 60 * 1000);
  } else {
    // Send immediately for paying customers
    await sendEmailNow(user, userSignals, false);
  }
}

async function sendEmailNow(user: UserSubscription, signals: TurtleSignal[], isDelayed: boolean): Promise<void> {
  const subject = isDelayed 
    ? `🐢 Turtelli Daily Signals (Delayed) - ${new Date().toLocaleDateString()}`
    : `🐢 Turtelli Daily Signals - ${new Date().toLocaleDateString()}`;

  const html = generateEmailHTML(user, signals, isDelayed);
  const text = generateEmailText(user, signals, isDelayed);

  const msg = {
    to: user.email,
    from: {
      email: 'no-reply@turtelli.com',
      name: 'Turtelli Trading Signals'
    },
    subject,
    text,
    html,
    trackingSettings: {
      clickTracking: { enable: true },
      openTracking: { enable: true }
    }
  };

  await sgMail.send(msg);
}

function generateEmailHTML(user: UserSubscription, signals: TurtleSignal[], isDelayed: boolean): string {
  const userName = user.displayName || user.email.split('@')[0];
  const delayedBadge = isDelayed ? '<span style="background: #ff9800; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-left: 10px;">DELAYED</span>' : '';
  
  const signalsHTML = signals.map(signal => `
    <div style="background: ${signal.action === 'BUY' ? '#e8f5e8' : '#ffebee'}; 
                border-left: 4px solid ${signal.action === 'BUY' ? '#4caf50' : '#f44336'}; 
                padding: 15px; margin: 10px 0; border-radius: 0 4px 4px 0;">
      <h3 style="margin: 0 0 10px 0; color: #333;">
        ${signal.ticker} - ${signal.action}
        <span style="background: ${signal.action === 'BUY' ? '#4caf50' : '#f44336'}; 
                     color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: 10px;">
          ${signal.market.toUpperCase()}
        </span>
      </h3>
      <p style="margin: 5px 0; font-size: 16px;"><strong>Entry Price:</strong> $${signal.price.toFixed(2)}</p>
      ${signal.stopLoss ? `<p style="margin: 5px 0;"><strong>Stop Loss:</strong> $${signal.stopLoss.toFixed(2)}</p>` : ''}
      ${signal.target ? `<p style="margin: 5px 0;"><strong>Target:</strong> $${signal.target.toFixed(2)}</p>` : ''}
      <p style="margin: 5px 0; color: #666; font-size: 14px;">
        Generated: ${signal.timestamp.toDate().toLocaleString()}
      </p>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Turtelli Daily Signals</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1976d2, #42a5f5); color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🐢 Turtelli</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Professional Turtle Trading Signals</p>
          ${delayedBadge}
        </div>
        
        <!-- Body -->
        <div style="padding: 30px 20px;">
          <h2 style="color: #1976d2; margin: 0 0 20px 0;">Hello ${userName}!</h2>
          <p style="margin: 0 0 20px 0;">Here are your daily Turtle Trading signals generated at 5:00 PM ET:</p>
          
          ${signalsHTML}
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin: 0 0 15px 0; color: #333;">📊 Trading Notes:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Signals are based on Turtle Trading system with 20-day breakouts</li>
              <li>Stop losses and targets are calculated using ATR (Average True Range)</li>
              <li>Always use proper position sizing and risk management</li>
              <li>Consider market conditions and news before executing trades</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://turtelli.com" 
               style="background: #1976d2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              View Full Dashboard
            </a>
          </div>
          
          ${user.subscription.type === 'free' ? `
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #856404;">🔔 Upgrade for Real-Time Signals</h4>
            <p style="margin: 0; color: #856404;">You're receiving delayed signals. Upgrade to Individual ($10/month) or Full Access ($30/month) for immediate delivery and more markets.</p>
            <a href="https://turtelli.com/subscription" style="color: #1976d2; text-decoration: none; font-weight: bold;">Upgrade Now →</a>
          </div>
          ` : ''}
        </div>
        
        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p style="margin: 0 0 10px 0;">
            <a href="https://turtelli.com" style="color: #1976d2; text-decoration: none;">Turtelli.com</a> | 
            <a href="https://turtelli.com/privacy" style="color: #1976d2; text-decoration: none;">Privacy Policy</a> | 
            <a href="https://turtelli.com/terms" style="color: #1976d2; text-decoration: none;">Terms</a>
          </p>
          <p style="margin: 0;">© 2025 Turtelli. All rights reserved.</p>
          <p style="margin: 10px 0 0 0; font-size: 12px;">
            <a href="mailto:support@turtelli.com" style="color: #1976d2; text-decoration: none;">Support</a> | 
            <a href="mailto:privacy@turtelli.com" style="color: #1976d2; text-decoration: none;">Privacy</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateEmailText(user: UserSubscription, signals: TurtleSignal[], isDelayed: boolean): string {
  const userName = user.displayName || user.email.split('@')[0];
  const delayedText = isDelayed ? ' (DELAYED)' : '';
  
  const signalsText = signals.map(signal => `
${signal.ticker} - ${signal.action} (${signal.market.toUpperCase()})
Entry Price: $${signal.price.toFixed(2)}
${signal.stopLoss ? `Stop Loss: $${signal.stopLoss.toFixed(2)}` : ''}
${signal.target ? `Target: $${signal.target.toFixed(2)}` : ''}
Generated: ${signal.timestamp.toDate().toLocaleString()}
  `).join('\n---\n');

  return `
TURTELLI DAILY SIGNALS${delayedText}
${new Date().toLocaleDateString()}

Hello ${userName}!

Here are your daily Turtle Trading signals generated at 5:00 PM ET:

${signalsText}

TRADING NOTES:
- Signals are based on Turtle Trading system with 20-day breakouts
- Stop losses and targets are calculated using ATR (Average True Range)
- Always use proper position sizing and risk management
- Consider market conditions and news before executing trades

View Full Dashboard: https://turtelli.com

---
Turtelli.com | Privacy Policy | Terms
© 2025 Turtelli. All rights reserved.
Support: support@turtelli.com
  `;
} 
import React, { useEffect } from 'react';
import { Box, Typography } from '@material-ui/core';

// Ad configuration placeholders
const adSensePublisherId = "[PROVIDE_ADSENSE_PUBLISHER_ID]";
const propellerAdsZoneId = "[PROVIDE_PROPELLERADS_ZONE_ID]";

const Ads = ({ type = 'banner', style = {} }) => {
  useEffect(() => {
    // Load AdSense ads
    if (window.adsbygoogle && adSensePublisherId !== "[PROVIDE_ADSENSE_PUBLISHER_ID]") {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }

    // Load PropellerAds
    if (propellerAdsZoneId !== "[PROVIDE_PROPELLERADS_ZONE_ID]") {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://zovidree.com/tag.min.js';
      script.setAttribute('data-zone', propellerAdsZoneId);
      document.body.appendChild(script);

      return () => {
        // Cleanup script
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  const defaultStyle = {
    margin: '20px 0',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    textAlign: 'center',
    minHeight: type === 'banner' ? '100px' : '250px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style
  };

  const renderAdSenseAd = () => {
    if (adSensePublisherId === "[PROVIDE_ADSENSE_PUBLISHER_ID]") {
      return (
        <Box sx={defaultStyle}>
          <Typography variant="body2" color="text.secondary">
            [AdSense Advertisement Placeholder]
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={defaultStyle}>
        <ins
          className="adsbygoogle"
          style={{
            display: type === 'banner' ? 'block' : 'inline-block',
            width: type === 'banner' ? '728px' : '300px',
            height: type === 'banner' ? '90px' : '250px'
          }}
          data-ad-client={adSensePublisherId}
          data-ad-slot="your-ad-slot-id"
          data-ad-format={type === 'banner' ? 'horizontal' : 'rectangle'}
          data-full-width-responsive="true"
        />
      </Box>
    );
  };

  const renderPropellerAd = () => {
    if (propellerAdsZoneId === "[PROVIDE_PROPELLERADS_ZONE_ID]") {
      return (
        <Box sx={defaultStyle}>
          <Typography variant="body2" color="text.secondary">
            [PropellerAds Advertisement Placeholder]
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={defaultStyle}>
        <div id={`propeller-${Date.now()}`} />
      </Box>
    );
  };

  return (
    <div className="ad-container">
      {/* AdSense Ad */}
      {renderAdSenseAd()}
      
      {/* PropellerAds Ad */}
      {renderPropellerAd()}
    </div>
  );
};

export default Ads; 
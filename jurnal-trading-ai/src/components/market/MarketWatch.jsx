import React, { useEffect, useRef } from 'react';

const MarketWatch = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Load TradingView Widget Script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": "light",
      "dateRange": "1D",
      "showChart": true,
      "locale": "en",
      "largeChartUrl": "",
      "isTransparent": false,
      "showSymbolLogo": true,
      "showFloatingTooltip": false,
      "width": "100%",
      "height": "600",
      "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
      "plotLineColorFalling": "rgba(41, 98, 255, 1)",
      "gridLineColor": "rgba(240, 243, 250, 0)",
      "scaleFontColor": "rgba(106, 109, 120, 1)",
      "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
      "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
      "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
      "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
      "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
      "tabs": [
        {
          "title": "Forex",
          "symbols": [
            {
              "s": "FX:EURUSD",
              "d": "EUR/USD"
            },
            {
              "s": "FX:GBPUSD",
              "d": "GBP/USD"
            },
            {
              "s": "FX:USDJPY",
              "d": "USD/JPY"
            },
            {
              "s": "FX:AUDUSD",
              "d": "AUD/USD"
            },
            {
              "s": "FX:USDCAD",
              "d": "USD/CAD"
            },
            {
              "s": "FX:USDCHF",
              "d": "USD/CHF"
            }
          ]
        },
        {
          "title": "Commodities",
          "symbols": [
            {
              "s": "OANDA:XAUUSD",
              "d": "Gold"
            },
            {
              "s": "OANDA:XAGUSD",
              "d": "Silver"
            },
            {
              "s": "TVC:USOIL",
              "d": "Crude Oil"
            }
          ]
        },
        {
          "title": "Indices",
          "symbols": [
            {
              "s": "FOREXCOM:SPXUSD",
              "d": "S&P 500"
            },
            {
              "s": "FOREXCOM:NSXUSD",
              "d": "Nasdaq 100"
            },
            {
              "s": "FOREXCOM:DJI",
              "d": "Dow 30"
            }
          ]
        }
      ]
    });

    // Clean up previous widget if it exists
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      const container = document.createElement('div');
      container.className = 'tradingview-widget-container';
      
      const widget = document.createElement('div');
      widget.className = 'tradingview-widget-container__widget';
      container.appendChild(widget);
      container.appendChild(script);
      
      containerRef.current.appendChild(container);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="market-watch">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Market Overview Widget */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Market Overview</h2>
          <div ref={containerRef} style={{ height: '600px' }} />
        </div>

        {/* Advanced Chart Widget */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Advanced Chart</h2>
          <div className="tradingview-widget-container">
            <div
              id="tradingview_advanced"
              style={{ height: '600px' }}
            />
            <script
              type="text/javascript"
              src="https://s3.tradingview.com/tv.js"
              async
            />
            <script
              type="text/javascript"
              dangerouslySetInnerHTML={{
                __html: `
                  new TradingView.widget({
                    "autosize": true,
                    "symbol": "FX:EURUSD",
                    "interval": "D",
                    "timezone": "Etc/UTC",
                    "theme": "light",
                    "style": "1",
                    "locale": "en",
                    "toolbar_bg": "#f1f3f6",
                    "enable_publishing": false,
                    "allow_symbol_change": true,
                    "container_id": "tradingview_advanced"
                  });
                `
              }}
            />
          </div>
        </div>
      </div>

      {/* Economic Calendar Widget */}
      <div className="mt-4 bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">Economic Calendar</h2>
        <div className="tradingview-widget-container">
          <div className="tradingview-widget-container__widget"></div>
          <script
            type="text/javascript"
            src="https://s3.tradingview.com/external-embedding/embed-widget-events.js"
            async
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "colorTheme": "light",
                "isTransparent": false,
                "width": "100%",
                "height": "600",
                "locale": "en",
                "importanceFilter": "-1,0,1",
                "currencyFilter": "USD,EUR,JPY,GBP,AUD,CAD,CHF"
              })
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MarketWatch;

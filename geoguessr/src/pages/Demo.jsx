/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import GoogleStreetview from './GoogleStreetview';

const Demo = () => {
    const key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
//   const [key, setKey] = useState(undefined);
  const [splitViewFlag, setSplitViewFlag] = useState(false);
  const [inputVal, setInputVal] = useState('');
  return (
    <>
      {key ? (
        !splitViewFlag ? (
            <GoogleStreetview apiKey={key} />
        ) : (
          <div>Loading</div>
        )
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h1>Enter your google streetview key to try it out</h1>
          <p>
            Get your google streetview key
            <a
              target="blank"
              href="https://developers.google.com/maps/documentation/javascript"
            >
              &nbsp;here
            </a>
          </p>
          <p>
            <input
              type="checkbox"
              onChange={() => setSplitViewFlag(!splitViewFlag)}
            />
            Use split screen view
          </p>
          <input value={inputVal} onChange={e => setInputVal(e.target.value)} />
          {/* <button onClick={() => setKey(inputVal)} type="button">
            Set key
          </button> */}
        </div>
      )}
    </>
  );
};

export default Demo;
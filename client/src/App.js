import React, { useEffect, useState } from 'react';
import { logo, language } from './assets';
import { BATTERY_TYPES } from "./constants"

import './App.css';

function App() {
  const [transformerCount, setTransformerCount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [batteries, setBatteries] = useState([]);
  const [counts, setCounts] = useState({
    mpxl: 0,
    mp2: 0,
    mp: 0,
    pp: 0,
  });

  useEffect(() => {
    fetch('/load-state')
      .then(response => response.json())
      .then(data => {
        if (data) {
          setCounts(data.counts || {});
          setTransformerCount(data.transformerCount || 0);
          setTotalCost(data.totalCost || 0);
          setTotalEnergy(data.totalEnergy || 0);
          setTotalSize(data.totalSize || 0);
          setBatteries(data.batteries || []);
        }
      });
  }, []);

  useEffect(() => {
    getTotals();
    getBatteries(counts);
    saveState();
  }, [counts]);

  const saveState = () => {
    const state = {
      transformerCount,
      totalCost,
      totalEnergy,
      totalSize,
      batteries,
      counts,
    };
  
    fetch('/save-state', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network error');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Fetch data failed:', error);
    });
  };

  const getBatteries = (counts) => {
    const items = [];
    const countItems = Object.entries(counts);
    let size = 0;
    let idx = 0;

    countItems.forEach(([battery, count]) => {
      while (count > 0) {
        const item = {
          id: `${battery}_${idx}`,
          x: idx % 2 === 0 ? 0 : idx % 2 * size,
          y: Math.floor(idx / 2) * 100,
          name: BATTERY_TYPES[battery].name,
          type: battery,
        };

        items.push(item);

        if(idx % 2 !== 0) {
          items.push({
            id: `t_${idx}`,
            x: 900,
            y: Math.floor(idx / 2) * 100,
            name: BATTERY_TYPES["t"].name,
            type: "t",
          })
        }

        count--;
        idx++;
        size = BATTERY_TYPES[battery].size;
      }
    });

    setBatteries(items);
  };

  const getTransformerCount = (updatedCounts) => {
    const total = Object.values(updatedCounts).reduce((acc, curr) => acc + curr, 0);
    return Math.floor(total / 2);
  };

  const handleQuantityChange = (e, id) => {
    const newCounts = {
      ...counts,
      [id]: parseInt(e.target.value, 10),
    };

    setCounts(newCounts);
    setTransformerCount(getTransformerCount(newCounts));
  };

  const getTotals = () => {
    const cost = BATTERY_TYPES.mpxl.cost * counts.mpxl + BATTERY_TYPES.mp2.cost * counts.mp2 + BATTERY_TYPES.mp.cost * counts.mp + BATTERY_TYPES.pp.cost * counts.pp + BATTERY_TYPES.t.cost * transformerCount;
    const energy = BATTERY_TYPES.mpxl.energy * counts.mpxl + BATTERY_TYPES.mp2.energy * counts.mp2 + BATTERY_TYPES.mp.energy * counts.mp + BATTERY_TYPES.pp.energy * counts.pp + BATTERY_TYPES.t.energy * transformerCount;
    const size = BATTERY_TYPES.mpxl.size * counts.mpxl + BATTERY_TYPES.mp2.size * counts.mp2 + BATTERY_TYPES.mp.size * counts.mp + BATTERY_TYPES.pp.size * counts.pp + BATTERY_TYPES.t.size * transformerCount;

    setTotalCost(cost);
    setTotalEnergy(energy);
    setTotalSize(size);
  };

  return (
    <>
      <div className="header">
        <img src={logo} className="logo" alt="Logo" />
        <img src={language} className="language" alt="Language" />
      </div>

      <div className="main">
        <div className="dashboard">
          <div className="total">
            <div className="title">Battery Configurator</div>
            <div className="total-container">
              <div className="total-item">
                <p>Total Cost</p>
                <p>{`$${totalCost.toLocaleString()}`}</p>
              </div>
              <div className="total-item">
                <p>Total Energy</p>
                <p>{`${totalEnergy} MWh`}</p>
              </div>
              <div className="total-item">
                <p>Total Size</p>
                <p>{`${totalSize} FT²`}</p>
              </div>
            </div>
          </div>
          <div className="quantity">
  <div className="grid-container">
    <div className="grid-header">
      <div>Battery Type</div>
      <div>Cost/unit ($)</div>
      <div>Energy/unit (MWh)</div>
      <div>Quantity</div>
    </div>
    {Object.values(BATTERY_TYPES).map((item) => (
      <div key={item.id} className="grid-item">
        <div>{item.name}</div>
        <div>{item.cost.toLocaleString()}</div>
        <div>{item.energy}</div>
        <div>
          <input
            aria-label="quantity count"
            disabled={item.id === "t"}
            max="1000"
            min="0"
            type="number"
            value={item.id === "t" ? transformerCount : counts[item.id]}
            onChange={(e) => handleQuantityChange(e, item.id)}
          />
        </div>
      </div>
    ))}
  </div>
  <span className="caption">1 transformer is added for every 2 batteries purchased</span>
</div>
        </div>
        <div className="container">
          {batteries.map((battery) => (
            <div
              key={battery.id}
              id={battery.id}
              className={`battery ${battery.type}`}
              style={{ left: `${battery.x}px`, top: `${battery.y}px` }}
            >
              {battery.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
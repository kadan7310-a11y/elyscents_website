// src/components/PerfumeBundles.jsx
import React from 'react';

const bundles = [
  { 
    top: "3 Pay 1 FREE", 
    img: "/products/abc.jpeg", 
    title: "BUY 3 50ML GET 50ML FREE", 
    off: "37% OFF",
    oldPrice: "Rs.7,100.00", newPrice: "Rs.4,444.00" 
  },
  { 
    top: "Buy Any 2x 100ML in Rs. 4,799", 
    img: "/products/xyz.jpeg", 
    title: "2X 100 ML DEAL", 
    off: "20% OFF",
    oldPrice: "Rs.6,000.00", newPrice: "Rs.4,800.00",
    reviews: "72 reviews"
  },
  { 
    top: "Get 3 best sellers in Rs. 4400", 
    img: "/products/adan.jpg", 
    title: "TOP 3 BEST SELLERS", 
    off: "21% OFF",
    oldPrice: "Rs.5,600.00", newPrice: "Rs.4,400.00",
    reviews: "289 reviews"
  },
  { 
    top: "Body Mist Deal", 
    img: "/products/khan.jpeg", 
    title: "BODY MIST 2X DEAL", 
    off: "15% OFF",
    oldPrice: "Rs.2,000.00", newPrice: "Rs.1,699.00"
  },
];

export default function PerfumeBundles() {
  return (
    <div style={{background: '#faf9f6', padding: '50px 20px'}}>
      <h2 style={{textAlign: 'center', fontSize: '32px', fontWeight: '800', letterSpacing: '3px', marginBottom: '35px', fontFamily: 'serif'}}>PERFUME BUNDLES</h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', maxWidth: '1250px', margin: '0 auto'}}>
        {bundles.map((b,i)=>(
          <div key={i} style={{background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eee'}}>
            <p style={{textAlign: 'center', fontSize: '11px', letterSpacing: '1px', padding: '10px 0', color: '#555'}}>{b.top}</p>
            <div style={{position: 'relative', background: '#f5f3ef', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <img src={b.img} alt={b.title} style={{height: '85%', objectFit: 'contain'}} onError={(e)=>e.target.src='https://via.placeholder.com/250x250?text=Add+Image'} />
              <span style={{position: 'absolute', bottom: '10px', left: '10px', background: '#e8e6e1', fontSize: '11px', padding: '4px 12px', borderRadius: '20px'}}>{b.off}</span>
            </div>
            <div style={{padding: '15px'}}>
              <h3 style={{fontSize: '14px', fontWeight: '700'}}>{b.title}</h3>
              {b.reviews && <div style={{fontSize: '12px', marginTop: '4px'}}>⭐⭐⭐⭐⭐ {b.reviews}</div>}
              <p style={{marginTop: '8px', fontSize: '13px'}}><span style={{textDecoration: 'line-through', color: '#999', marginRight: '8px'}}>{b.oldPrice}</span><b>{b.newPrice}</b></p>
              <button style={{width: '100%', marginTop: '12px', background: 'black', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', letterSpacing: '1px'}}>ADD TO CART</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import GeneralContext from "../contexts/GeneralContext";
import "./FoodItem.scss";

const FoodItem = ({ allFeatures }) => {

  const id = useParams().id.split("_").join(" ");
  const { menuItems } = useContext(GeneralContext);
  const [item, setItem] = useState();

  console.log(item);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  useEffect(() => {
    setItem(menuItems.filter(e => e.item === id)[0]);
  }, [menuItems]); // eslint-disable-line

  return (
    <div className="food-item">
      <img
        src="../wave.jpg"
        alt="wave"
        className="wave-img"
      />
      {item ? 
        <div className="item">
          <div className="left-side">
            <img 
              src={item.image}
              alt={item.item+' image'}
              className="item-img"
            />
          </div>
          <div className="right-side">
            <div className="name-price">
              <span className="title">{item.item}</span>
              <span className="item-price">${item.price / 100}</span>
            </div>
            <div className="feature-image-part">
              { item.features[0] !== null ? 
              item.features.sort().map(e => {
                const row = allFeatures.filter(row => row.id === e)[0];
                  return (
                    <img 
                      src={row.image} 
                      alt={row.name}
                      key={row.id}
                      className="feature-image"
                    />
                  )
                }) : <span></span>
              }
            </div>
            <p className="description">{item.description}</p>
            
          </div>
        </div> :
        <div className="item-not-exist">
          <p>This item does not exist!</p>
        </div>
      }
    </div>
  )
}

export default FoodItem;
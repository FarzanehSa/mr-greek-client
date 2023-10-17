import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import GeneralContext from "../contexts/GeneralContext";
import "./FoodItem.scss";

const FoodItem = ({ allFeatures }) => {

  const id = useParams().id.split("_").join(" ");
  const { menuItems } = useContext(GeneralContext);
  const [item, setItem] = useState();
  const [itemFeatures, setItemFeatures] = [];

  console.log(itemFeatures);
    console.log(item);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  useEffect(() => {
    setItem(menuItems.filter(e => e.item === id)[0]);
  }, [menuItems]);

  // useEffect(() => {
  //   if (item.features) {

  //     const myFeatures = item.features.map(e => {
  //       return (
  //         allFeatures.filter(row => row.id === e)
  //       )
  //     });
  //     setItemFeatures(myFeatures);
  //   }
  // }, [item]);

  return (
    item &&
    <div className="food-item">
        <img
          src="../wave.jpg"
          alt="wave"
          className="wave-img"
        />
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
              {item.features.sort().map(e => {
                const row = allFeatures.filter(row => row.id === e)[0];
                  return (
                    <img 
                      src={row.image} 
                      alt={row.name}
                      key={row.id}
                      className="feature-image"
                    />
                  )
                })
              }
            </div>
            <p className="description">{item.description}</p>
            
          </div>
        </div>
    </div>
  )
}

export default FoodItem;
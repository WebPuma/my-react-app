import React from "react";
import "./Timestamp.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faChartLine,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";

const FEATURES = [
  {
    title: "All your expenses in one place",
    description:
      "Pharetra nunc magna libero sagittis facilisis purus commodo donec dolor. Netus pellentesque.",
    icon: faCoins,
  },
  {
    title: "Transparent spending",
    description:
      "Tincidunt nisi felis elementum commodo id. Imperdiet diam elit cras morbi in.",
    icon: faChartLine,
  },
  {
    title: "Complete privacy and protection",
    description:
      "Phasellus nisi eu nunc quam ipsum interdum placerat varius.",
    icon: faShieldAlt,
  },
];

function Timestamp() {
  return (
    <section className="timestamp">
      <div className="timestamp__inner">
        <div className="timestamp__icon-stack" aria-hidden="true">
          <span className="timestamp__icon-layer timestamp__icon-layer--bottom" />
          <span className="timestamp__icon-layer timestamp__icon-layer--top" />
        </div>
        <h2 className="timestamp__title">
          Pay where you want, when you want, how you want
        </h2>
        <p className="timestamp__subtitle">
          Dolor tellus magna egestas amet. Quisque sed ultrices sagittis
        </p>

        <ul className="timestamp__features" role="list">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="timestamp__feature">
              <div className="timestamp__feature-icon" aria-hidden="true">
                <FontAwesomeIcon icon={feature.icon} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </li>
          ))}
        </ul>
      </div>

      {/**
       * Previous layout for quick reference:
       * <div className="timestamp">Timestamp Component</div>
       */}
    </section>
  );
}

export default Timestamp;

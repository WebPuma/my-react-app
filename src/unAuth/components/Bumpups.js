import React from "react";
import "./Bumpups.css";
import heroImage from "../../assets/bumpups-hero.jpg";

function Bumpups() {
  return (
    <section className="bumpups">
      <div
        className="bumpups-hero"
        style={{
          backgroundImage: `linear-gradient(200deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.55) 100%), url(${heroImage})`,
        }}
      >
        <div className="bumpups-hero__content">
          <h1>Lorem ipsum dolor sit amet consectetur.</h1>
          <h2>Morbi tristique senectus et netus et malesuada fames ac turpis egestas.</h2>
        </div>

        <form className="bumpups-search" role="search">
          <label htmlFor="bumpups-search-input" className="sr-only">
            Search the site
          </label>
          <input
            id="bumpups-search-input"
            type="search"
            placeholder="Search destinations, adventures, or experiences"
            aria-label="Search destinations, adventures, or experiences"
          />
          <button type="submit">Search</button>
        </form>
      </div>
    </section>
  );
}

export default Bumpups;

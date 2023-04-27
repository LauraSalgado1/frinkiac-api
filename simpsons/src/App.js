import "./App.css";
import React, { useCallback, useRef, useState } from "react";
import axios from "axios";
import { toPng } from "html-to-image";

export default function App() {
  const [contentResult, setContentResult] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [text, setText] = useState(null);

  function handleSearchSubmit(event) {
    event.preventDefault();
    const searchTerm = event.target.elements.search.value;
    axios
      .get(`https://frinkiac.com/api/search?q=${searchTerm}`)
      .then((response) => {
        if (response.data.length > 0) {
          //console.log(response.data);
          getImages(response.data);
          setNoResults(false);
        } else {
          setContentResult(null);
          setNoResults(true);
        }
      })
      .catch((error) => console.log(error));
  }

  function handleTextSubmit(event) {
    event.preventDefault();
    const textTerm = event.target.elements.text.value;
    setText(textTerm);
  }

  function getImages(resultArray) {
    const result = resultArray;

    result.map((item) => {
      item.image = `https://frinkiac.com/img/${item.Episode}/${item.Timestamp}.jpg`;
    });

    //console.log(result);
    setContentResult(result);
  }

  const cardsList = contentResult?.map((card) => (
    <li className="item" key={card.Id}>
      <button
        onClick={() => {
          setSelectedImage(card.image);
        }}
      >
        <img src={card.image} />
      </button>
    </li>
  ));

  const preview = useRef(null);

  const onButtonClick = useCallback(() => {
    if (preview.current === null) {
      return;
    }

    toPng(preview.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-image-name.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [preview]);

  return (
    <>
      <main>
        <div className="inner">
          <h1>Simpsons shirt machine</h1>
          <section>
            <h2>Step 1: Image</h2>
            <p>Enter a search term to find images.</p>
            <form onSubmit={handleSearchSubmit}>
              <label htmlFor="search">Search</label>
              <input type="search" id="search"></input>
              <input type="submit" value="Search It"></input>
            </form>
            {contentResult ? (
              <ul className="images-list">{cardsList}</ul>
            ) : null}
            {noResults ? "Sorry, no results" : null}
          </section>
          <section>
            <h2>Step 2: Text</h2>
            <p>Add your own writing. </p>
            <form onSubmit={handleTextSubmit}>
              <label htmlFor="search">Your text</label>
              <input type="text" id="text"></input>
              <input type="submit" value="Add Text"></input>
            </form>
          </section>
          <section>
            <h2>Step 3: Preview your shirt</h2>
            <p>Imagine your own head and arms poking out of this bad boy!</p>
            <div className="preview" id="preview">
              <div ref={preview} className="t-shirt-content">
                <img src={selectedImage} />
                <p>{text}</p>
              </div>
            </div>
          </section>
          <section>
            step 4 export your design
            <div className="design" ref={preview}>
              <img src={selectedImage} />
              <p>{text}</p>
              <p>&nbsp;</p>
            </div>
            <button onClick={onButtonClick}>Export file</button>
          </section>
        </div>
      </main>
      <footer>
        <p>
          Built in React by&nbsp;
          <a
            href="https://www.laurasalgado.com/"
            target="_blank"
            rel="noreferrer"
          >
            Laura Salgado
          </a>{" "}
        </p>
        <p>Data Frinkiac API</p>
      </footer>
    </>
  );
}

import "./App.css";
import React, { useCallback, useRef, useState } from "react";
import axios from "axios";
import { toPng } from "html-to-image";

export default function App() {
  const [imagesResult, setImagesResult] = useState(null);
  const [imageTerm, setImageTerm] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [text, setText] = useState(null);
  const [step, setStep] = useState(1);
  const [textColor, setTextColor] = useState(null);

  function handleSearchSubmit(event) {
    event.preventDefault();
    const searchTerm = event.target.elements.search.value;
    setImageTerm(searchTerm);
    axios
      .get(`https://frinkiac.com/api/search?q=${searchTerm}`)
      .then((response) => {
        if (response.data.length > 0) {
          getImages(response.data);
          setNoResults(false);
        } else {
          setImagesResult(null);
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

  const colors = [
    { hex: "#000000", name: "black" },

    { hex: "#ffffff", name: "white" },
  ];

  const colorsList = colors?.map((color) => (
    <li key={color.name}>
      <button
        className={color.name}
        onClick={() => {
          handleColorChange(color.name);
        }}
        style={{ color: color.hex }}
      >
        {color.name} text
        {textColor === color.name ? (
          <span className="complete">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="currentColor"
                d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"
              />
            </svg>
          </span>
        ) : null}
        <span className="selected"></span>
      </button>
    </li>
  ));

  function handleColorChange(value) {
    const colorTerm = value;
    setTextColor(colorTerm);
  }

  function getImages(resultArray) {
    const result = resultArray;

    result.map((item) => {
      item.image = `https://frinkiac.com/img/${item.Episode}/${item.Timestamp}.jpg`;
    });
    setImagesResult(result);
  }

  const cardsList = imagesResult?.map((card) => (
    <li className="item" key={card.Id}>
      {selectedImage === card.image ? (
        <button
          className="selected"
          onClick={() => {
            setSelectedImage(card.image);
          }}
        >
          <img src={card.image} alt={`Simpsons screencap of ${imageTerm}`} />
        </button>
      ) : (
        <button
          onClick={() => {
            setSelectedImage(card.image);
          }}
        >
          <img src={card.image} alt={`Simpsons screencap of ${imageTerm}`} />
        </button>
      )}
    </li>
  ));

  function handleStep(step) {
    setStep(step);
  }

  const preview = useRef(null);

  const onButtonClick = useCallback(() => {
    if (preview.current === null) {
      return;
    }

    toPng(preview.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-cool-simpsons-shirt.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [preview]);

  const refresh = () => {
    if (window.confirm("Remove your current design and start again?")) {
      window.location.reload(true);
    }
  };

  return (
    <>
      <header>
        <div className="inner">
          <h1>Simpsons Shirt Designer</h1>
          <div className="steps">
            <ul>
              <li>
                {step === 1 ? (
                  <span className="step current">
                    1. Image
                    {selectedImage ? (
                      <span className="complete">
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            fill="currentColor"
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"
                          />
                        </svg>
                      </span>
                    ) : null}
                  </span>
                ) : (
                  <button
                    className="step clickable"
                    onClick={() => {
                      handleStep(1);
                    }}
                  >
                    1. Image
                    {selectedImage ? (
                      <span className="complete">
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            fill="currentColor"
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"
                          />
                        </svg>
                      </span>
                    ) : null}
                  </button>
                )}
              </li>
              <li>
                {step === 1 && selectedImage ? (
                  <button
                    onClick={() => {
                      handleStep(2);
                    }}
                    className="step clickable"
                  >
                    2. Text
                    {text ? (
                      <span className="complete">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            fill="currentColor"
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"
                          />
                        </svg>
                      </span>
                    ) : null}
                  </button>
                ) : null}

                {step === 1 && !selectedImage ? (
                  <span className="step">
                    2. Text{" "}
                    {text ? (
                      <span className="complete">
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            fill="currentColor"
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"
                          />
                        </svg>
                      </span>
                    ) : null}
                  </span>
                ) : null}

                {step === 2 ? (
                  <span className="step current">
                    2. Text{" "}
                    {text ? (
                      <span className="complete">
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            fill="currentColor"
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"
                          />
                        </svg>
                      </span>
                    ) : null}
                  </span>
                ) : null}

                {step === 4 || step === 3 ? (
                  <button
                    onClick={() => {
                      handleStep(2);
                    }}
                    className="step clickable"
                  >
                    2. Text
                    {text ? (
                      <span className="complete">
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            fill="currentColor"
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"
                          />
                        </svg>
                      </span>
                    ) : null}
                  </button>
                ) : null}
              </li>

              <li>
                {step === 3 ? (
                  <span className="step current">
                    3. Style
                    {textColor ? (
                      <span className="complete">
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            fill="currentColor"
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"
                          />
                        </svg>
                      </span>
                    ) : null}
                  </span>
                ) : null}

                {text && step !== 3 ? (
                  <button
                    onClick={() => {
                      handleStep(3);
                    }}
                    className="step clickable"
                  >
                    3. Style
                    {textColor ? (
                      <span className="complete">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            fill="currentColor"
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"
                          />
                        </svg>
                      </span>
                    ) : null}
                  </button>
                ) : null}

                {!text ? (
                  <span className="step">
                    3. Style
                    {textColor ? (
                      <span className="complete">
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            fill="currentColor"
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z"
                          />
                        </svg>
                      </span>
                    ) : null}
                  </span>
                ) : null}
              </li>

              <li>
                {step === 4 && selectedImage && text ? (
                  <span className="step current">4. Export</span>
                ) : null}

                {step !== 4 && selectedImage && text && textColor ? (
                  <button
                    className="step clickable"
                    onClick={() => {
                      handleStep(4);
                    }}
                  >
                    4. Export
                  </button>
                ) : null}

                {!selectedImage || !text || !textColor ? (
                  <span className="step">4. Export</span>
                ) : null}
              </li>
            </ul>
          </div>
        </div>
      </header>
      <main>
        <div className="inner">
          <div className="columns">
            <div>
              {step === 1 ? (
                <section>
                  <h2>
                    Step 1<span className="font-regular">:</span>
                  </h2>
                  <form onSubmit={handleSearchSubmit}>
                    <label className="font-regular" htmlFor="search">
                      Search images. Quotes work well.
                    </label>
                    <div className="form-row">
                      <input type="search" id="search"></input>
                      <input type="submit" value="Search"></input>
                    </div>
                  </form>
                  {imagesResult ? (
                    <>
                      <h3>Select an image</h3>
                      <ul className="images-list">{cardsList}</ul>
                    </>
                  ) : null}
                  {noResults ? (
                    <p className="font-regular label">
                      Sorry, no results! Try another search term.
                    </p>
                  ) : null}
                </section>
              ) : null}

              {step === 2 ? (
                <section>
                  <h2>
                    Step 2<span className="font-regular">:</span>
                  </h2>
                  <form onSubmit={handleTextSubmit}>
                    <label className="font-regular" htmlFor="search">
                      Add your own text. Type anything!
                    </label>
                    <div className="form-row">
                      <input type="text" id="text"></input>
                      <input type="submit" value="Add Text"></input>
                    </div>
                  </form>
                </section>
              ) : null}

              {step === 3 ? (
                <section>
                  <h2>
                    Step 3<span className="font-regular">:</span>
                  </h2>

                  <p className="font-regular label">Choose a text color.</p>

                  <ul className="colors-list">{colorsList}</ul>
                </section>
              ) : null}

              {step === 4 ? (
                <section>
                  <h2>
                    Step 4<span className="font-regular">:</span>
                  </h2>
                  <p className="font-regular label">
                    The image file includes your custom image and text on a
                    transparent background.
                  </p>
                  <p className="font-regular label">
                    Make your t-shirt dreams come true!
                  </p>
                </section>
              ) : null}
            </div>

            <div className="column-fixed">
              <section className="preview-container">
                <div className="preview-top">
                  {step === 1 && selectedImage ? (
                    <button
                      onClick={() => {
                        handleStep(2);
                      }}
                    >
                      <span>
                        Next<span className="font-regular">:</span>
                      </span>{" "}
                      Add Text
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          fill="currentColor"
                          d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6l-6 6Z"
                        />
                      </svg>
                    </button>
                  ) : null}

                  {step === 2 && text ? (
                    <button
                      onClick={() => {
                        handleStep(3);
                      }}
                    >
                      <span>
                        Next<span className="font-regular">:</span>
                      </span>
                      Style
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          fill="currentColor"
                          d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6l-6 6Z"
                        />
                      </svg>
                    </button>
                  ) : null}

                  {step === 3 && textColor ? (
                    <button
                      onClick={() => {
                        handleStep(4);
                      }}
                    >
                      <span>
                        Next<span className="font-regular">:</span>
                      </span>
                      Export
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          fill="currentColor"
                          d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6l-6 6Z"
                        />
                      </svg>
                    </button>
                  ) : null}
                </div>

                {/* {step !== 4 && textColor !== "black" ? (
                  <div className="preview white-text" id="preview">
                    <div ref={preview} className="t-shirt-content">
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt={`Simpsons screencap of ${imageTerm}`}
                        />
                      ) : null}

                      <p>{text}</p>
                    </div>
                  </div>
                ) : null} */}

                {step === 1 || step === 2 ? (
                  <div className="preview" id="preview">
                    <div ref={preview} className="t-shirt-content">
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt={`Simpsons screencap of ${imageTerm}`}
                        />
                      ) : null}

                      <p>{text}</p>
                    </div>
                  </div>
                ) : null}

                {step === 3 && textColor !== "white" ? (
                  <div className="preview" id="preview">
                    <div ref={preview} className="t-shirt-content">
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt={`Simpsons screencap of ${imageTerm}`}
                        />
                      ) : null}

                      <p>{text}</p>
                    </div>
                  </div>
                ) : null}

                {step === 3 && textColor === "white" ? (
                  <div className="preview white-text" id="preview">
                    <div ref={preview} className="t-shirt-content">
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt={`Simpsons screencap of ${imageTerm}`}
                        />
                      ) : null}

                      <p>{text}</p>
                    </div>
                  </div>
                ) : null}
              </section>
            </div>
          </div>

          {step === 4 ? (
            <>
              <div className="buttons">
                <button className="download-button" onClick={onButtonClick}>
                  download png
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      fill="currentColor"
                      d="M19 9h-4V3H9v6H5l7 7l7-7zM5 18v2h14v-2H5z"
                    />
                  </svg>
                </button>

                <button onClick={refresh}>
                  Try Again{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      fill="currentColor"
                      d="M10.6 16q0-2.025.363-2.913T12.5 11.15q1.025-.9 1.563-1.563t.537-1.512q0-1.025-.687-1.7T12 5.7q-1.275 0-1.938.775T9.126 8.05L6.55 6.95q.525-1.6 1.925-2.775T12 3q2.625 0 4.038 1.463t1.412 3.512q0 1.25-.537 2.138t-1.688 2.012Q14 13.3 13.738 13.913T13.475 16H10.6Zm1.4 6q-.825 0-1.412-.588T10 20q0-.825.588-1.413T12 18q.825 0 1.413.588T14 20q0 .825-.588 1.413T12 22Z"
                    />
                  </svg>
                </button>
              </div>
              <section>
                <div className="design" ref={preview}>
                  <img
                    src={selectedImage}
                    alt={`Simpsons screencap of ${imageTerm}`}
                  />
                  <p className="design-text" style={{ color: textColor }}>
                    {text}
                  </p>
                  <p>&nbsp;</p>
                </div>
              </section>
            </>
          ) : null}
        </div>
      </main>
      <footer>
        <div className="inner">
          <p>
            <span className="font-regular">Built in React by:&nbsp;</span>
            <a
              href="https://www.laurasalgado.com/"
              target="_blank"
              rel="noreferrer"
            >
              Laura Salgado
            </a>{" "}
          </p>
          <p>
            <span className="font-regular">Data:&nbsp;</span>
            <a
              href="https://frinkiac.com/api/random"
              target="_blank"
              rel="noreferrer"
            >
              Frinkiac API
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}

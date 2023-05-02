import "./App.css";
import React, { useCallback, useRef, useState } from "react";
import axios from "axios";
import { toPng } from "html-to-image";

export default function App() {
  const [contentResult, setContentResult] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [text, setText] = useState(null);
  const [step, setStep] = useState(1);

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

                {step === 3 ? (
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
                {step === 3 && selectedImage && text ? (
                  <span className="step current">3. Export</span>
                ) : null}

                {step !== 3 && selectedImage && text ? (
                  <button
                    className="step clickable"
                    onClick={() => {
                      handleStep(3);
                    }}
                  >
                    3. Export
                  </button>
                ) : null}

                {!selectedImage || !text ? (
                  <span className="step">3. Export</span>
                ) : null}
              </li>
            </ul>
          </div>
        </div>
      </header>
      <main>
        <div className="inner">
          <div class="columns">
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
                  {contentResult ? (
                    <>
                      <h3>Select an image</h3>
                      <ul className="images-list">{cardsList}</ul>
                    </>
                  ) : null}
                  {noResults ? "Sorry, no results" : null}
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
            </div>

            {step !== 3 ? (
              <div class="column-fixed">
                <section>
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

                  <div className="preview" id="preview">
                    <div ref={preview} className="t-shirt-content">
                      <img src={selectedImage} />

                      <p>{text}</p>
                    </div>
                  </div>
                </section>
              </div>
            ) : null}
          </div>
          {step === 3 ? (
            <>
              <section>
                <h2>
                  Step 3<span className="font-regular">:</span>
                </h2>

                <div className="text-container">
                  <p className="font-regular label">
                    Your combined image file includes your custom image and text
                    on a transparent background.
                  </p>
                  <p className="font-regular label">
                    Make your t-shirt dreams come true!
                  </p>
                </div>

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

                <div className="design" ref={preview}>
                  <img src={selectedImage} />
                  <p className="design-text">{text}</p>
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

import "./App.css";
import React, { useCallback, useRef, useState } from "react";
import axios from "axios";
import { toPng } from "html-to-image";
import Modal from "./components/Modal";

export default function App() {
  const [contentResult, setContentResult] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [text, setText] = useState(null);
  const [step, setStep] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  const buttonText = "Open my design";

  const modalContent = (
    <>
      <div className="design" ref={preview}>
        <img src={selectedImage} />
        <p>{text}</p>
        <p>&nbsp;</p>
      </div>
      <button onClick={onButtonClick}>Export as png</button>
    </>
  );

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
                    1 Image
                    {selectedImage ? (
                      <span className="complete">&#10003;</span>
                    ) : null}
                  </span>
                ) : (
                  <button
                    className="step clickable"
                    onClick={() => {
                      handleStep(1);
                    }}
                  >
                    1 Image
                    {selectedImage ? (
                      <span className="complete">&#10003;</span>
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
                    2 Text
                    {text ? <span className="complete">&#10003;</span> : null}
                  </button>
                ) : null}

                {step === 1 && !selectedImage ? (
                  <span className="step">
                    2 Text{" "}
                    {text ? <span className="complete">&#10003;</span> : null}
                  </span>
                ) : null}

                {step === 2 ? (
                  <span className="step current">
                    2 Text{" "}
                    {text ? <span className="complete">&#10003;</span> : null}
                  </span>
                ) : null}

                {step === 3 ? (
                  <button
                    onClick={() => {
                      handleStep(2);
                    }}
                    className="step clickable"
                  >
                    2 Text
                    {text ? <span className="complete">&#10003;</span> : null}
                  </button>
                ) : null}
              </li>
              <li>
                {step === 3 && selectedImage && text ? (
                  <span className="step current">3 Export</span>
                ) : null}

                {step !== 3 && selectedImage && text ? (
                  <button
                    className="step clickable"
                    onClick={() => {
                      handleStep(3);
                    }}
                  >
                    3 Export
                  </button>
                ) : null}

                {!selectedImage || !text ? (
                  <span className="step">3 Export</span>
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
                    Step 1: <br />
                    Enter a search term to find images
                  </h2>
                  <form onSubmit={handleSearchSubmit}>
                    <label htmlFor="search">Search</label>
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
                    Step 2:
                    <br />
                    Add your own text. Type anything!
                  </h2>
                  <form onSubmit={handleTextSubmit}>
                    <label htmlFor="search">Your text</label>
                    <input type="text" id="text"></input>
                    <input type="submit" value="Add Text"></input>
                  </form>
                </section>
              ) : null}

              {step === 3 ? (
                <>
                  <section>
                    <h2>
                      Step 3:
                      <br /> Download your design
                    </h2>
                    <Modal
                      modalIsOpen={modalIsOpen}
                      openModal={openModal}
                      closeModal={closeModal}
                      modalContent={modalContent}
                      buttonText={buttonText}
                    />
                  </section>
                </>
              ) : null}
            </div>

            <div class="column-fixed">
              <section>
                <div className="preview-top">
                  <h2>Shirt Preview</h2>
                  {step === 1 && selectedImage ? (
                    <button
                      onClick={() => {
                        handleStep(2);
                      }}
                    >
                      Next: Add Text
                    </button>
                  ) : null}

                  {step === 2 && text ? (
                    <button
                      onClick={() => {
                        handleStep(3);
                      }}
                    >
                      Next: Export
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
          </div>
        </div>
      </main>
      <footer>
        <div className="inner">
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
        </div>
      </footer>
    </>
  );
}

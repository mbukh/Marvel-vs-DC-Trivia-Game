import "normalize.css";
import "reset-css";
import "./style/App.css";
import { useState, useEffect } from "react";
import { getRandomCharacters, getPublishers } from "./services/api";
import {
    bg2,
    trueImage,
    falseImage,
    arrows,
    marvel,
    dc,
} from "./assets/images";
import Cards from "./components/Cards";
import Spinner from "./components/Spinner";

const cardsCount = 15;

function App() {
    const [characters, setCharacters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [publishers, setPublishers] = useState([]);

    useEffect(() => {}, []);

    useEffect(() => {
        // Images preloader
        const characters = getRandomCharacters(cardsCount, ["DC", "Marvel"]);
        const imagesToPreload = characters.map(
            (character) => character.images.lg
        );

        const images = [];
        imagesToPreload.forEach((url) => {
            const image = new Image();
            image.src = url;
            images.push(image);
        });

        // Wait for all images to load
        Promise.all(images.map((image) => image.decode()))
            .then(() => {
                setCharacters(characters);
                // Let loading animation happen
                setTimeout(() => {
                    setIsLoading(false);
                }, 2200);
            })
            .catch((err) => console.error(err));

        return () => {
            // Clean up the image objects
            images.forEach((image) => URL.revokeObjectURL(image.src));
        };
    }, []);

    return (
        <div className="App" style={{ backgroundImage: `url(${bg2})` }}>
            <div className="top">
                <div
                    className="dc"
                    style={{ backgroundImage: `url(${dc[0]})` }}
                ></div>
                <div
                    className="arrows"
                    style={{ backgroundImage: `url(${arrows})` }}
                ></div>
                <div
                    className="marvel"
                    style={{ backgroundImage: `url(${marvel[1]})` }}
                ></div>
            </div>
            {!isLoading ? <Cards characters={characters} /> : <Spinner />}
            <h2 className="user-score">0</h2>
        </div>
    );
}

export default App;

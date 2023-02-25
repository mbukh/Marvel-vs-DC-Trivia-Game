import "normalize.css";
import "reset-css";
import "./style/App.css";
import { useState, useEffect } from "react";
import { getRandomCharacters } from "./services/api";
import {
    bgImages,
    arrows,
    marvel,
    dc,
    comicStamps,
    restart,
} from "./assets/images";
import Cards from "./components/Cards";
import Spinner from "./components/Spinner";

function App() {
    const [finishGame, setFinishGame] = useState(false);
    const [showStamp, setShowStamp] = useState(false);
    const [showRestart, setShowRestart] = useState(false);
    const [points, setPoints] = useState(0);
    const [characters, setCharacters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [publishers, setPublishers] = useState(["DC", "Marvel"]);
    const [sides, setSides] = useState({ left: "DC", right: "Marvel" });
    const [cardsCount, setCardsCount] = useState(5);

    const handleAddPoint = () => {
        setPoints((prev) => (!finishGame ? prev + 1 : 0));
    };

    const restartGame = () => {
        setFinishGame(false);
        setShowRestart(false);
        setIsLoading(true);
        setPoints(0);
    };

    useEffect(() => {
        if (!isLoading) return;
        // Images preloader
        const characters = getRandomCharacters(cardsCount, publishers);
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
        // Clean up the image objects
        return () => {
            images.forEach((image) => URL.revokeObjectURL(image.src));
        };
    }, [isLoading, publishers, cardsCount]);

    // remove stamp overlay timeout
    useEffect(() => {
        if (finishGame) {
            setShowStamp(true);
            setTimeout(() => setShowStamp(false), 2000);
            setTimeout(() => setShowRestart(true), 4000);
        }
    }, [finishGame]);

    return (
        <div className="App" style={{ backgroundImage: `url(${bgImages[1]})` }}>
            <div className="top">
                <div
                    className="dc"
                    style={{ backgroundImage: `url(${dc[0]})` }}
                ></div>
                <div
                    className={!finishGame ? "arrows" : "arrows stop"}
                    style={{ backgroundImage: `url(${arrows})` }}
                ></div>

                {showRestart && (
                    <button
                        className="restart"
                        style={{ backgroundImage: `url(${restart})` }}
                        onClick={restartGame}
                    ></button>
                )}

                <div
                    className="marvel"
                    style={{ backgroundImage: `url(${marvel[1]})` }}
                ></div>
            </div>

            {!isLoading && characters.length ? (
                <Cards
                    characters={characters}
                    sides={sides}
                    points={points}
                    addPoint={handleAddPoint}
                    finishGame={finishGame}
                    setFinishGame={setFinishGame}
                />
            ) : (
                <Spinner />
            )}

            <h2 className="user-score">
                {points} / {characters.length}
            </h2>

            {showStamp && (
                <div className="stamp">
                    <i
                        style={{
                            backgroundImage: `url(${
                                comicStamps[
                                    Math.floor(
                                        Math.random() * comicStamps.length
                                    )
                                ]
                            })`,
                        }}
                    ></i>
                </div>
            )}
        </div>
    );
}

export default App;

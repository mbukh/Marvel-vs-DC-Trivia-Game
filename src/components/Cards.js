import "../style/Cards.css";
import { arrow } from "../assets/images/";
import { createRef, useRef, useState, useMemo, useEffect } from "react";
// https://github.com/3DJakob/react-tinder-card-demo/blob/master/src/examples/Advanced.js
import TinderCard from "react-tinder-card";

function Cards({
    characters,
    sides,
    addPoint,
    finishGame,
    setFinishGame,
    roundCount,
}) {
    const [currentIndex, setCurrentIndex] = useState(characters.length - 1);
    // deal with outOfFrameHandler closure not getting the most resent finishGame
    const currentIndexRef = useRef(currentIndex);
    const answerRefs = useRef([]);
    const childRefs = useMemo(
        () => [...Array(characters.length)].map((i) => createRef()),
        [characters]
    );
    const welcomeCardRef = useRef(null);

    const updateCurrentIndex = (val) => {
        setCurrentIndex(val);
        currentIndexRef.current = val;
    };

    const swiped = (direction, index) => {
        // Skip welcome card
        if (direction === "ignore") {
            console.log("welcome card is out");
            welcomeCardRef.isOut = true;
            return;
        }
        // set last direction
        const currentRef = childRefs[index].current;
        // Debounce multiple events at a time
        clearTimeout(currentRef?.cardSwipedTimeout);
        currentRef.cardSwipedTimeout = setTimeout(() => {
            console.log("Swiped #", index);
            // decrease current index
            updateCurrentIndex(index - 1);
            console.log("CurrentIndex #", currentIndex);
        }, 100);
    };

    const outOfFrame = (direction, index) => {
        const currentCardRef = childRefs[index].current;
        const cardPlayed = answerRefs.current[index] !== undefined;
        if (cardPlayed) return;
        // Debounce multiple events at a time
        clearTimeout(currentCardRef?.cardOffFrameTimeout);
        currentCardRef.cardOffFrameTimeout = setTimeout(() => {
            if (currentIndexRef.current < 0) setFinishGame(true);
            console.log(
                `#${index} left the screen to the ${direction}! Current id:${currentIndexRef.current}`
            );
            const cardPublisher = characters[index].biography.publisher;
            const correctAnswer = cardPublisher.includes(sides[direction]);
            if (correctAnswer) addPoint();
            answerRefs.current[index] = correctAnswer.toString();
        }, 50);
    };

    // Card swiped but haven't not exited the screen
    // const swiped = (dir, index) => {};

    // New round
    useEffect(() => {
        console.log("New round. Current index:", currentIndex);

        const keydownHandler = (e) => {
            const direction =
                e.keyCode === 37 ? "left" : e.keyCode === 39 ? "right" : false;
            if (!direction || currentIndex < 0) return;
            if (welcomeCardRef.current && !welcomeCardRef.isOut)
                welcomeCardRef.current.swipe(direction);
            else childRefs[currentIndex].current.swipe(direction);
        };
        document.addEventListener("keydown", keydownHandler);
        // Remove event before next level
        return () => document.removeEventListener("keydown", keydownHandler);
    }, [roundCount, childRefs, currentIndex]);

    // Finish Game routine
    useEffect(() => {
        if (!finishGame) return;
        const alignCardForSummary = (card, index) => {
            const id = Number(card.className.match(/\d+/)[0]);
            const character = characters.find((ch) => ch.id === id);
            const randomHOffsetWithinScreen =
                -card.offsetWidth / 3 +
                ((window.screen.width + card.offsetWidth / 4) / 4) *
                    (1 - index / characters.length);
            const verticalOffsetWithinUI =
                -card.offsetHeight / 3.5 +
                ((index / 2) * card.offsetHeight) / 4;
            card.style = "";
            character.biography.publisher.includes(sides.right)
                ? (card.style.left = `${randomHOffsetWithinScreen}px`)
                : (card.style.right = `${randomHOffsetWithinScreen}px`);
            card.style.opacity = 0;
            card.style.scale = 0.5;
            card.style.top = `${verticalOffsetWithinUI}px`;
            card.classList.add(answerRefs.current[index]);
            setTimeout(() => (card.style.opacity = 1), 1000);
        };
        // Manipulation DOM styles
        const cards = document.querySelectorAll(".swipe:not(.welcome)");
        cards.forEach((card, index) =>
            setTimeout(() => alignCardForSummary(card, index), 500)
        );
        childRefs.forEach((ref) =>
            setTimeout(async () => await ref.current.restoreCard(), 1500)
        );
    }, [finishGame, characters, childRefs, sides, answerRefs]);

    return (
        <div className="Card_container">
            {characters.map((character, index) => (
                <TinderCard
                    key={character.id}
                    ref={childRefs[index]}
                    className={`swipe ch${character.id}`}
                    onSwipe={(dir) => swiped(dir, index)}
                    onCardLeftScreen={(dir) => outOfFrame(dir, index)}
                    flickOnSwipe={!finishGame}
                    preventSwipe={[`up`, `down`]}
                >
                    <div
                        className="card"
                        style={{
                            backgroundImage: "url(" + character.images.lg + ")",
                        }}
                    >
                        <h3>{character.name}</h3>
                    </div>
                </TinderCard>
            ))}

            {roundCount === 1 && (
                <TinderCard
                    ref={welcomeCardRef}
                    key="welcome"
                    className="swipe welcome"
                    onSwipe={(dir) => swiped("ignore", -1)}
                    onCardLeftScreen={() => true}
                    preventSwipe={[`up`, `down`]}
                >
                    <div className="card welcome">
                        <p>This card is here to welcome you</p>
                        <p>
                            Guess whether the superhero or supervillain on the
                            card is from Marvel or DC comics
                        </p>
                        <p>Don't you dare to fail!</p>
                        <h3>
                            Swipe or Press
                            <span
                                className="arrow left"
                                style={{ backgroundImage: `url(${arrow})` }}
                            ></span>
                            <span
                                className="arrow right"
                                style={{ backgroundImage: `url(${arrow})` }}
                            ></span>
                        </h3>
                    </div>
                </TinderCard>
            )}
        </div>
    );
}

export default Cards;

import "../style/Cards.css";
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

    const updateCurrentIndex = (val) => {
        setCurrentIndex(val);
        currentIndexRef.current = val;
    };

    const swiped = (direction, index) => {
        // Skip welcome card
        if (direction === "ignore") {
            console.log("welcome card is out");
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

    // const swiped = (id) => {};

    useEffect(() => {
        // Finish Game routine
        if (!finishGame) return;
        const alignCardForSummary = (card, index) => {
            const id = Number(card.className.match(/\d+/)[0]);
            const character = characters.find((ch) => ch.id === id);

            const randomHOffsetWithinScreen =
                -card.offsetWidth / 3.5 +
                ((window.screen.width / 2 + card.offsetWidth * 2.5) / 10) *
                    (1 - index / characters.length);
            const verticalOffsetWithinUI =
                -card.offsetHeight / 3 +
                ((index / 2) * card.offsetHeight) / 3.5;
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
        // setFinishGame(false);
        // setNextGame({});
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
                    key="welcome"
                    className="swipe welcome"
                    onSwipe={(dir) => swiped("ignore", -1)}
                    onCardLeftScreen={() => true}
                    preventSwipe={[`up`, `down`]}
                >
                    <div className="card welcome">
                        <p>This card was placed here to welcome you</p>
                        <p>
                            Guess whether the superhero on the card is from
                            Marvel or DC comics
                        </p>
                        <p>Don't you dare to fail!</p>
                        <h3>Swipe to start</h3>
                    </div>
                </TinderCard>
            )}
        </div>
    );
}

export default Cards;

import "../style/Cards.css";
import TinderCard from "react-tinder-card";

function Cards({ characters }) {
    const swiped = (direction, nameToDelete) => {
        console.log(`i'm in swiped`, direction, nameToDelete);
    };

    const outOfFrame = (name) => {
        console.log(`enough tinder today`);
    };

    return (
        <div className="tinderCard_container">
            {characters.map((character) => (
                <TinderCard
                    key={character.id}
                    className="swipe"
                    preventSwipe={[`up`, `down`]}
                    onSwipe={(dir) => swiped(dir, character.name)}
                    onCardLeftScreen={() => outOfFrame(character.name)}
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
        </div>
    );
}
export default Cards;

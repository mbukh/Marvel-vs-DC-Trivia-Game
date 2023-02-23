import { allCharacters } from "./db";
import { getRandomNonRepeatingNumbers } from "../utils";

const getRandomCharacters = (number, publishers) => {
    const characters = allCharacters.filter((character) =>
        publishers.some((publisher) =>
            character.biography.publisher.includes(publisher)
        )
    );
    const charactersId = getRandomNonRepeatingNumbers({
        min: 1,
        max: characters.length - 1,
        count: number,
    });
    const charactersArr = charactersId.map((id) => characters[id]);
    return charactersArr;
};

export { getRandomCharacters, getPublishers };

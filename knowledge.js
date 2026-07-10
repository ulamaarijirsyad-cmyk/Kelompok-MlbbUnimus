const KNOWLEDGE_PATH = "./knowledge/";

let knowledge = {};

export async function loadKnowledge() {

    const [
        heroGuide,
        draft,
        counter,
        items
    ] = await Promise.all([

        fetch(KNOWLEDGE_PATH + "hero-guide.json").then(r => r.json()),

        fetch(KNOWLEDGE_PATH + "draft.json").then(r => r.json()),

        fetch(KNOWLEDGE_PATH + "counter.json").then(r => r.json()),

        fetch(KNOWLEDGE_PATH + "items.json").then(r => r.json())

    ]);

    knowledge = {

        heroGuide,

        draft,

        counter,

        items

    };

    console.log("Knowledge Loaded");

    console.log(knowledge);

}

export function getKnowledge(){

    return knowledge;

}
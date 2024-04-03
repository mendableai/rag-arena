"use server";

export async function splitText(text: string, splitOption: number) {
    try {


        const response = await fetch("http://localhost:5000/python/split-text", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text, splitOption }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
    }

}


"use server";

export async function splitText(text: string, splitOption: number) {
    try {


        const response = await fetch("http://localhost:5000/python/split-text", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: "test", split_option: 2 }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Assuming the response is text. Use response.json() for JSON.
        const responseBody = await response.json(); // Note the change to .json()

        console.log(responseBody);

        // Return a plain object or text, depending on your needs
        return { data: responseBody };
    } catch (error) {
        console.error(error);
    }

}


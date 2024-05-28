import config from "../config";

const BASE_URL = `${config.backendExternal.url}${config.backendExternal.mapping.song}`;

export const validateSongExists = async (songId: number) => {
    try {
        const response = await fetch(`${BASE_URL}/${songId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Unable to verify song existence: ${error.message}`);
        }
    }
};
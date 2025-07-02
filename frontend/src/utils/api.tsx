import axios from 'axios';

type Story = {
    id: string;
    title: string;
    summary: string;
    score: number;
}

const API_BASE = "https://api.dwindled.dev"
 
export const search = async (text: string): Promise<Story[]> => {
    try {
        const response = await axios.post(`${API_BASE}/query/`, {
            content: text,
        });
        return response.data;
    } catch (error) {
        console.error("Error while posting text in search:", error);
        throw error;
    }
};

export const scrape = async (url: string): Promise<void> => {
    try {
        await axios.post(`${API_BASE}/scrape/`, {
            url: url,
        });
    } catch (error) {
        console.error("Error while queuing url for scraping:", error)
        throw error;
    }
}
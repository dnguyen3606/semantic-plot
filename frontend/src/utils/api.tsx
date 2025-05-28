import axios from 'axios';

type Story = {
    id: string;
    title: string;
    summary: string;
    score: number;
}
 
export const search = async (text: string): Promise<Story[]> => {
     try {
         const response = await axios.post("https://api.dwindled.dev/query/", text);
         return response.data;
     } catch (error) {
         console.error("Error while posting text in search:", error);
         throw error;
     }
 };
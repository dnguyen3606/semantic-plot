import axios from 'axios';
 
export const search = async (text: string) => {
     try {
         const response = await axios.post("https://api.dwindled.dev/query/", text);
         console.log(response.data);
         return response.data;
     } catch (error) {
         console.error("Error while posting text in search:", error);
         throw error;
     }
 };
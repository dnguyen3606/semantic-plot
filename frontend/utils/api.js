import axios from 'axios';

const search = async (text) => {
    try {
        const response = await axios.post("http://127.0.0.1:8000/query/", text);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error while posting text in search:", error);
        throw error;
    }
};

export default search;
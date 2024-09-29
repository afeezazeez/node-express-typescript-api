import app  from "./app";
import databaseService from "./utils/database/database.service";
const PORT = 3000;

(async ()=>{
    await databaseService.authenticate();
})();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

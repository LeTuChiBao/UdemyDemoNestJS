import { rm } from "fs/promises";
import { join } from "path";
global.beforeEach(async()=> {
   try {
    await rm(join(__dirname,'..','test.sqlite'),{force:true});
   } catch (error) {
    console.log("Error in setup.ts", error)
   }
});
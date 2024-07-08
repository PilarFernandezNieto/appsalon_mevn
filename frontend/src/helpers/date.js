import { parse, formatISO } from "date-fns";

export function convertToISO(stringDate){
    const newDate = parse(stringDate, "dd/MM/yyyy", new Date())
   return formatISO(newDate);
}
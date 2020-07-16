
export class Constants {

    public static TEST_ID: string = "Test ID";
    public static VALID_TILL: string = "Valid Till";

    public static FIRST_NAME: string = "First name";
    public static LAST_NAME: string = "Last name";
    public static DATE_OF_BIRTH: string = "Date of birth";
    public static PHONE: string = "Phone";
    public static EMAIL: string = "E-mail";

    // we 
    public static NONHASHED_FIELDS: Set<string> = new Set([
         Constants.FIRST_NAME, Constants.LAST_NAME, Constants.DATE_OF_BIRTH,
         Constants.PHONE, Constants.EMAIL
    ]);

}
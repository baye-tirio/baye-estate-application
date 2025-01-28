// Creating a custom error object
export const manualError = (StatusCode,Message) => {
    // console.log("In The manual error generation controller");
    const error = new Error();
    error.statusCode = StatusCode;
    error.message = Message;
    // console.log("The error from the manual error controller is as below");    
    return error;
}
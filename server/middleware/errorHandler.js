const errorHandler = (err, req, res, next) => {
    let status = err.status || err.statusCode || 500;
    let message = err.message || "Something went wrong";

    if (err.name === "ValidationError") {
        status = 400;
        message = "Validation failed";
    } else if (err.name === "CastError") {
        status = 400;
        message = "Invalid id";
    } else if (err.code === 11000) {
        status = 409;
        const field = Object.keys(err.keyValue || {})[0] || "field";
        message = `${field} already in use`;
    }

    if (status >= 500) {
        console.error("[errorHandler]", err);
    }

    res.status(status).json({
        success: false,
        error: { message },
    });
};

export default errorHandler;

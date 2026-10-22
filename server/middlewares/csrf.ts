import { Request, Response, NextFunction } from 'express';

// Lightweight CSRF defence for cookie-based sessions (cookies are sameSite=none in production).
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

const requireAjaxHeader = (req: Request, res: Response, next: NextFunction) => {
    if (SAFE_METHODS.includes(req.method)) return next();
    if (req.get('X-Requested-With') !== 'XMLHttpRequest') {
        return res.status(403).json({ message: 'Invalid request origin' });
    }
    next();
};

export default requireAjaxHeader;

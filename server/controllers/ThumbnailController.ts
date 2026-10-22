import { Request, Response } from 'express';
import Thumbnail from '../models/Thumbnail.js';
import { v2 as cloudinary } from 'cloudinary';

const stylePrompts = {
    'Bold & Graphic':
        'eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style',
    'Tech/Futuristic':
        'futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere',
    'Minimalist':
        'minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point',
    'Photorealistic':
        'photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field',
    'Illustrated':
        'illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style',
};

const colorSchemeDescriptions = {
    vibrant:
        'vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette',
    sunset:
        'warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow',
    forest:
        'natural green tones, earthy colors, calm and organic palette, fresh atmosphere',
    neon:
        'neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow',
    purple:
        'purple-dominant color palette, magenta and violet tones, modern and stylish mood',
    monochrome:
        'black and white color scheme, high contrast, dramatic lighting, timeless aesthetic',
    ocean:
        'cool blue and teal tones, aquatic color palette, fresh and clean atmosphere',
    pastel:
        'soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic',
};

export const generateThumbnail = async (
    req: Request,
    res: Response
) => {
    try {
        const { userId } = req.session;

        const {
            title,
            prompt: user_prompt,
            style,
            aspect_ratio,
            color_scheme,
            text_overlay,
        } = req.body;

        // Create the thumbnail record
        const thumbnail = await Thumbnail.create({
            userId,
            title,
            prompt_used: user_prompt,
            user_prompt,
            style,
            aspect_ratio,
            color_scheme,
            text_overlay,
            isGenerating: true,
        });

        // Build the image-generation prompt
        const selectedStyle =
            stylePrompts[style as keyof typeof stylePrompts] || style;

        let prompt = `Create a ${selectedStyle} for: "${title}".`;

        if (color_scheme) {
            const selectedColor =
                colorSchemeDescriptions[
                    color_scheme as keyof typeof colorSchemeDescriptions
                ] || color_scheme;

            prompt += ` Use a ${selectedColor} color scheme.`;
        }

        if (user_prompt) {
            prompt += ` Additional details: ${user_prompt}.`;
        }

        prompt +=
            ' The thumbnail should be visually stunning and designed to maximize click-through rate. Make it bold, professional, and impossible to ignore.';

        // Get Cloudflare credentials from server/.env
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
        const apiToken = process.env.CLOUDFLARE_API_TOKEN?.trim();

        if (!accountId || !apiToken) {
            throw new Error(
                'Cloudflare credentials are missing from .env'
            );
        }

        // Generate the image using Cloudflare Workers AI
        const cfResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    steps: 4,
                }),
            }
        );

        // Read the API response
        const cfData = (await cfResponse.json()) as {
            success?: boolean;
            errors?: { message: string }[];
            result?: { image?: string };
        };

        if (
            !cfResponse.ok ||
            !cfData.success ||
            !cfData.result?.image
        ) {
            const errorMessage = cfData.errors
                ?.map((error) => error.message)
                .join(', ');

            throw new Error(
                errorMessage ||
                    'Failed to generate image using Cloudflare Workers AI'
            );
        }

        // Convert the Base64 image into a data URL
        const base64Image =
            `data:image/jpeg;base64,${cfData.result.image}`;

        // Upload the generated image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(
            base64Image,
            {
                resource_type: 'image',
            }
        );

        // Save the image URL and update the thumbnail
        thumbnail.image_url = uploadResult.secure_url;
        thumbnail.isGenerating = false;

        await thumbnail.save();

        // Send the result to the frontend
        res.json({
            message: 'Thumbnail Generated',
            thumbnail,
        });
    } catch (error: any) {
        console.error('Thumbnail generation error:', error);

        res.status(500).json({
            message: error.message || 'Failed to generate thumbnail',
        });
    }
};

// Delete a thumbnail
export const deleteThumbnail = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        const { userId } = req.session;

        const deletedThumbnail = await Thumbnail.findOneAndDelete({
            _id: id,
            userId,
        });

        if (!deletedThumbnail) {
            res.status(404).json({
                message: 'Thumbnail not found',
            });
            return;
        }

        res.json({
            message: 'Thumbnail deleted successfully',
        });
    } catch (error: any) {
        console.error('Thumbnail deletion error:', error);

        res.status(500).json({
            message: error.message || 'Failed to delete thumbnail',
        });
    }
};
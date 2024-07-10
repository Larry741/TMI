import { StaticImageData } from "next/image";

export interface Testimonial {
	name: String;
	organization: String;
	comment: String;
	imgSrc: string | StaticImageData;
}

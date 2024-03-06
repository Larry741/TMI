import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from "swiper";
import { SwiperBreakpoints } from "@/interface/index";

interface Props {
	children: any;
	heading: string;
	hasContainer?: boolean;
	breakpoints: SwiperBreakpoints;
}

const StatCardContainer = ({
	children,
	heading,
	hasContainer = false,
	breakpoints,
}: Props) => {
	return (
		<>
			<div className={`stats`}>
				{heading ? <h2 className="size_16-18">{heading}</h2> : null}

				<div className={"slider_container"}>
					<Swiper
						breakpoints={breakpoints}
						pagination={{
							clickable: true,
							dynamicBullets: true,
						}}
						autoplay={{
							delay: 15000,
							disableOnInteraction: false,
						}}
						loop={true}
						spaceBetween={15}
						modules={[Navigation, Autoplay]}
						// cssMode={true}
						className="swiper-no-padding">
						{children}
					</Swiper>
				</div>
			</div>
		</>
	);
};

export default StatCardContainer;

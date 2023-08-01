import React, { useState } from "react";
import Slider from "react-slick";

const Test = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        beforeChange: (current, next) => {
            setCurrentSlide(next);
        },
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />
    };

    const slides = [
        { imgSrc: "link_to_image1.jpg", text: "Text 1" },
        { imgSrc: "link_to_image2.jpg", text: "Text 2" },
        { imgSrc: "link_to_image3.jpg", text: "Text 3" },
        // Add more images and texts as needed
    ];

    return (
        <div className="slider-container">
            <h2>Single Item</h2>
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <div key={index}>
                        <img src={slide.imgSrc} alt={`Slide ${index + 1}`} />
                        <p>{slide.text}</p>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

// Custom previous arrow component
const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return <div className="custom-arrow prev-arrow" onClick={onClick} />;
};

// Custom next arrow component
const CustomNextArrow = (props) => {
    const { onClick } = props;
    return <div className="custom-arrow next-arrow" onClick={onClick} />;
};

export default Test;
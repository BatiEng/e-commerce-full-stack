import { assets } from "../assets/frontend_assets/assets";
import Title from "../components/Title";
import NewsLetterBox from "./../components/NewsLetterBox";

function About() {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod magni
            rerum blanditiis doloribus dicta, rem nemo vitae vero, laborum
            cupiditate distinctio, perferendis culpa recusandae officia amet
            nobis placeat. Enim, excepturi!
          </p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Neque illo
            eligendi harum, sapiente quidem repudiandae ab asperiores quas
            blanditiis repellendus, libero dolor aspernatur, iste natus culpa
            optio est eveniet magnam!
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
            facilis molestiae repudiandae deleniti magnam! Sunt ea in, culpa
            nostrum dicta accusantium sit optio amet dolore architecto adipisci
            error est quisquam.
          </p>
        </div>
      </div>
      <div className="text-4xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
            aliquid deserunt obcaecati tempora sit iure dolore, maiores
            explicabo recusanda
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
            aliquid deserunt obcaecati tempora sit iure dolore, maiores
            explicabo recusanda
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
            aliquid deserunt obcaecati tempora sit iure dolore, maiores
            explicabo recusanda
          </p>
        </div>
      </div>
      <NewsLetterBox />
    </div>
  );
}

export default About;

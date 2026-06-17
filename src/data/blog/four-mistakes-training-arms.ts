import type { BlogPost } from "./types";
import { blocksSr } from "./four-mistakes-training-arms.sr";

export const fourMistakesArmsPost: BlogPost = {
  slug: "four-mistakes-training-arms",
  title: "4 Mistakes When Training Arms",
  excerpt:
    "From leaning back on curls to skipping triceps — four common arm training mistakes that stop your biceps and triceps from growing.",
  metaTitle: "4 Mistakes When Training Arms — Biceps & Triceps Tips",
  metaDescription:
    "Avoid leaning back on curls, neglecting triceps, too little variation, and lifting too heavy. Four common arm training mistakes and how to fix them.",
  keywords: [
    "arm training mistakes",
    "biceps workout tips",
    "triceps training",
    "how to grow arms",
    "arm workout men over 35",
  ],
  publishedAt: "2026-06-14",
  readingTimeMinutes: 5,
  coverImage: "/blog/arm-training.jpg",
  coverImageAlt: "Man training biceps with dumbbells in the gym",
  featuredOnHomepage: true,
  blocks: [
    {
      type: "p",
      text: "You know what they say: 'Sun's out, guns out' but what if your guns (arms) are distinctly lacking in terms of size and definition, and you struggle to fill out a small/medium shirt?",
    },
    {
      type: "p",
      text: "When people flex their muscles, 9 times out of 10, their go-to pose will be a single, or a double bicep pose. You see plenty of people flexing their biceps for selfies when out and about or in the gym, yet you don't see many people busting out a rear lat spread or a cheeky side chest.",
    },
    {
      type: "p",
      text: "It's all well and good flexing your biceps if you've a set of arms that would give Arnold himself a run for his money, but what about if your arms resemble strings of spaghetti and your bicep peaks are more like flat hills, no matter how many bicep curls you pump out? Well, if this is the case, you may be training your arms incorrectly.",
    },
    {
      type: "p",
      text: "Here's a look at 4 common mistakes when training arms.",
    },
    { type: "h2", text: "Leaning back as you curl" },
    {
      type: "p",
      text: "Let's face it, if you want to train your biceps you are going to have to get used to curling.",
    },
    {
      type: "p",
      text: "There are plenty of bicep curl variations (more on that later) yet the main mistake people can make when curling is leaning back to gain momentum.",
    },
    {
      type: "p",
      text: "Leaning back as you curl will not only put you at risk of a back injury, but it will also render the exercise far less effective. Remember, it's tension that will make the muscles grow as you are literally looking to create as many micro rips and tears in the muscle fibres as possible. Leaning back reduces tension placed upon the biceps, which obviously means less muscle will be built.",
    },
    { type: "h2", text: "Not training triceps" },
    {
      type: "p",
      text: "If you really want a set of sleeve-busting arms, believe it or not but it isn't just biceps that you should focus on. In fact, if you want bigger arms, you need to perform more triceps exercises.",
    },
    {
      type: "p",
      text: "Far too many people focus on training the biceps when they're looking to build up their arms, yet focussing solely on the biceps will only build a big biceps muscle, not a big set of arms.",
    },
    {
      type: "p",
      text: "The triceps muscle has 3 heads, hence the name, and it is much larger than the biceps muscle. Therefore, the bigger your triceps, the bigger your arms will look.",
    },
    { type: "h2", text: "Not enough variation" },
    {
      type: "p",
      text: "Okay, we get it, everybody has their own unique preferences when it comes to gym exercises for specific body parts, and for the arms that's no different. More than likely, your top 2 bicep exercises are dumbbell curls and EZ curls, and your primary triceps exercise is the triceps rope pushdown. Don't get us wrong, these are great exercises, but they aren't the only exercises.",
    },
    {
      type: "p",
      text: "For optimal muscle hypertrophy, it is always best to switch up your routine and add some variation in there, in order to keep the muscles guessing.",
    },
    {
      type: "p",
      text: "Try different bicep and triceps exercises, different weights, different equipment, different rep ranges, and a different amount of sets and you'll be amazed by just how much more pumped your arms feel once you've finished training.",
    },
    { type: "h2", text: "Don't lift too heavy" },
    {
      type: "p",
      text: "For muscle hypertrophy (growth) progressive overload training can be very beneficial, and one way of overloading the muscles is to lift heavier weights than they are used to. The thing to remember here however, is that if you try lifting too heavy, your form will suffer and you won't hit the target muscles or perform the exercise correctly.",
    },
    {
      type: "p",
      text: "By all means train heavy, but don't lift weights that are clearly too heavy for you to handle, as the only way you will lift them will be via rocking and leaning back and forth for momentum, so you won't work the biceps or triceps properly.",
    },
    {
      type: "p",
      text: 'For optimal muscle growth, choose a weight that tests you, but that you are in control of for the duration of your working set. If at the end of your working set, you need to "cheat" ever so slightly to force out a rep or two, that\'s acceptable, but cheating from the start is not.',
    },
    {
      type: "cta",
      title: "Train arms as part of a system — not a standalone obsession",
      primaryHref: "/training",
      primaryLabel: "See Training Programs",
      secondaryHref: "/pricing",
      secondaryLabel: "Get Full Access — {{price}}",
    },
  ],
  blocksByLocale: { sr: blocksSr },
};

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

import {
  BodyScan, 
  Compass, 
  Clipboard, 
  Karate, 
  Mickey, 
  Smile, 
  MasksTheater, 
  Family, 
  MagicWand, 
  Monumnet, 
  Ghost, 
  Music, 
  MysteryMood, 
  HeartMood, 
  Rocket, 
  TV, 
  Skull, 
  Swords, 
  Hat, 
  MovieFilmStrip,
  Star,
  Theater
} from "../../../assets/SvgIcons";


export const GenresIcons: { [key: string]: IconComponent } = {
  "Action": Karate,
  "Adventure": Compass,
  "Animation": Mickey,
  "Comedy": Smile,
  "Crime": BodyScan,
  "Documentary": Clipboard,
  "Drama": MasksTheater,
  "Family": Family,
  "Fantasy": MagicWand,
  "History": Monumnet,
  "Horror": Ghost,
  "Music": Music,
  "Mystery": MysteryMood,
  "Romance": HeartMood,
  "Science Fiction": Rocket,
  "TV Movie": TV,
  "Thriller": Skull,
  "War": Swords,
  "Western": Hat,
};


export const CategoriesIcons: { [key: string]: IconComponent } = {
  "Popular": MovieFilmStrip,
  "Top Rated": Star,
  "Upcoming": Theater,
};
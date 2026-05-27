function(instance, properties) {
const pluginName = 'Recurring Dates';
const backgroundImageURL = 'https://dd7tel2830j4w.cloudfront.net/f1657909891733x252060774418280580/watch-grey.svg';

const box = $(`<div style="font-family: Lato; font-size: 14px; display: flex; align-items: center; justify-content: center; width: 200px; 
height: 140px; padding: 10px 40px; style="text-align: center;"><div style="text-align: center; padding: 10px; background-color: #fff; 
border-radius:13px; box-shadow: 1px 10px 24px -9px rgba(0,0,0,.50);"><p style="font-weight: 400; color:#000; margin: 0px;">${pluginName}</p></div></div>`);

box.css('background-image', `url(${backgroundImageURL})`);
box.css('background-repeat', 'repeat');
box.css('background-size', '28px 28px');
box.css('background-position', 'top');
box.css('padding', 0);
box.css('height', properties.bubble.height - 0);
box.css('width', properties.bubble.width - 0);

instance.canvas.append(box);
if (instance.isResponsive) {
  instance.setHeight(properties.bubble.width);
}



}
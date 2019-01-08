/*
 * initial-default - выставление стилей из настроек 
 * animation - переключение hostShow и начало анимации 
*/
export type ShowState = 'initial' | 'initial-default' | 'initial-thumbnail-image' | 'initial-virtual-image' | 'animation' | 'animation-end';

/*
 * initial - определяет начало закрытия  
 * reset-scale - означает что изображение было увеличено и нужно выполнить resetScale()
 * initial-styles - подготовка стилей для начала анимации: выставление высоты контейнера и положения 
 * animation - изменение позиции и начало анимации 
 * animation-end - transitionEnd: возврат скрытого изображения и удаление окна лайтбокса 
*/
export type ClosingState = 'initial' | 'reset-scale' | 'initial-styles' | 'animation' | 'animation-end';
$ ->
  afterLoadFn = (anchorLink, index) ->
    console.log 1
    $activeSection = $(@)
    if index is 2
      console.log 2
      $activeSection.find('video').get(0).play()
    else
      console.log 3
      $('video').get(0).pause()

  afterSlideLoadFn = (anchorLink, index, slideAnchor, slideIndex) ->
    console.log 4


  $('#fullpage').fullpage
    anchors: ['firstPage', 'secondPage', 'thirdPage', 'lastPage'],
    menu: '#menu'
    afterLoad: afterLoadFn
    afterSlideLoad: afterSlideLoadFn



/** @format */

export const BusinessConfigurations = [
   {
      _id: '1',
      pageName: 'Sistema-Encuestas',
      title1: 'Oncare Cancer Center',
      description1:
         'Especialistas en diagnósticos,tratamientos y atención multidisciplinaria de pacientes con Cáncer y otras enfermedades graves.',
      title2: 'Sistema de encuestas',
      description2: 'Sistema de procesamiento automático de encuestas.',
      title3: 'Objetivo',

      description3: [
         {
            descId: 1,
            desc: 'Procesar encuestas de forma automática, rápida y precisa.',
         },
      ],
      sidebar: [
         {
            sidebarId: 1,
            sidebarText: 'OnCare Cancer Center',
         },
         {
            sidebarId: 2,
            sidebarText: 'Contactanos: www.oncare.com.mx',
         },
      ],
      /*
    If you want to display a link to the company website or contact support link, add the link to that screen as below:
    linkToCompanyWebsite: "/admin/uploadsurveyanswers"
    It will appear in the box at the right of the bullets of the Home page.
    */
      linkToCompanyWebsite: '',
      settings: [
         {
            priority: 1,
            label: 'Oncare Cancer Center',
            subLabel: 'Cancer Center',
            imageSrc: './images/ONCARELogo.jpg',
            alt: 'ArtPixan Image',
            height: '390px',
            width: '100%',
         },
         {
            priority: 2,
            label: 'Encuestas',
            subLabel: 'Sistema procesador de encuestas.',
            imageSrc:
               './images/1-OverwhelmedBySoftware-PhotobyThisisEngineering_RAEngonUnsplash.jpg',
            alt: 'ArtPixan Image',
            height: '390px',
            width: '100%',
         },
      ],
   },
]

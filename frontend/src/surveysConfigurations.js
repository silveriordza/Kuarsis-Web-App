 

import {SRV_BLANK_CONCAT_2NDROW_PREVIOUS_HEADER,
SRV_CONCAT_1STROW_HEADER_2NDROW_HEADER,
SRV_FIRST_ROW_HAS_HEADERS,
SRV_SECOND_ROW_HAS_HEADERS} from './constants/surveyConstants'

export const surveysConfigurations = [
  {
    surveyName: 'OnCare Treatment Center',
    subSurvey: [
      {
      _id: '1',
      subSurveyName: 'Informacion General Paciente',
      headerParserModificators: [ 
        {
          modificator: SRV_BLANK_CONCAT_2NDROW_PREVIOUS_HEADER, 
          startColumn: 0,
          endColumn: 21,
        }
      ]

    },
    {
      _id: '2',
      subSurveyName: 'CGS',
      headerParserModificators: [ 
        {
          modificator: SRV_BLANK_CONCAT_2NDROW_PREVIOUS_HEADER, 
          startColumn: 22,
          endColumn: 51,
        }
      ]
    },
    {
      _id: '3',
      subSurveyName: 'FIAD-15 (NOFP)',
      headerParserModificators: [ 
        {
          modificator: SRV_SECOND_ROW_HAS_HEADERS, 
          startColumn: 52,
      endColumn: 66,
        }
      ]
    },
    {
      _id: '4',
      subSurveyName: 'SRV4',
      headerParserModificators: [ 
        {
          modificator: SRV_SECOND_ROW_HAS_HEADERS, 
          startColumn: 67,
          endColumn: 88,
        }
      ]
    },
    {
      _id: '5',
      subSurveyName: 'SRV5',
      description: 'Instrucciones: a continuación marque los sucesos que ha vivido en el último año.',
      headerParserModificators: [ 
        {
          modificator: SRV_SECOND_ROW_HAS_HEADERS, 
          startColumn: 89,
          endColumn: 128,
        }
      ]
    },
    {
      _id: '6',
      subSurveyName: 'SRV6',
      description: 'Instrucciones: La respuesta corresponde a los 7 días previos. Deberá calificarse el grado de intensidad de acuerdo a la siguiente escala. Anotando el número correspondiente dentro del paréntesis.',
      headerParserModificators: [ 
        {
          modificator: SRV_SECOND_ROW_HAS_HEADERS, 
          startColumn: 129,
          endColumn: 141,
        }
      ]
    },
    {
      _id: '7',
      subSurveyName: 'SRV7',
      description: 'Instrucciones: Indique el grado hasta el que está de acuerdo o en desacuerdo con cada una de las siguientes afirmaciones según la siguiente escala.Instrucciones: La respuesta corresponde a los 7 días previos. Deberá calificarse el grado de intensidad de acuerdo a la siguiente escala. Anotando el número correspondiente dentro del paréntesis.',
      headerParserModificators: [ 
        {
          modificator: SRV_SECOND_ROW_HAS_HEADERS, 
          startColumn: 142, 
          endColumn: 161,
        }
      ]
    },
    {
      _id: '8',
      subSurveyName: 'SRV8',
      description: 'NPI',
      headerParserModificators: [ 
        {modificator: SRV_CONCAT_1STROW_HEADER_2NDROW_HEADER, startColumn: 162, endColumn: 205},
        {modificator: SRV_FIRST_ROW_HAS_HEADERS, startColumn: 206, endColumn: 215 }, 
      ]
    },
    {
      _id: '9',
      subSurveyName: 'SRV9',
      description: 'Señale hasta que punto se ha sentido molesto por el síntoma:',
      headerParserModificators: [ 
        {
          modificator: SRV_SECOND_ROW_HAS_HEADERS, 
          startColumn: 216,
          endColumn: 305,
        }, 
      ]
    },
    {
      _id: '10',
      subSurveyName: 'SRV10',
      description: 'Instrucciones: Indique su grado de acuerdo o desacuerdo en cada una de las siguientes afirmaciones marcando el espacio apropiado. Utilice la siguiente escala de 7 puntos (un mayor número en la escala indica un mayor acuerdo).',
      headerParserModificators: [ 
        {
          modificator: SRV_SECOND_ROW_HAS_HEADERS, 
          startColumn: 306,
          endColumn: 325,
        }, 
      ]
    },
    {
      _id: '11',
      subSurveyName: 'SRV11',
      description: 'NPI',
      headerParserModificators: [ 
        {
          modificator: SRV_BLANK_CONCAT_2NDROW_PREVIOUS_HEADER, 
          startColumn: 326,
          endColumn: 332,
        }, 
        {
          modificator: SRV_FIRST_ROW_HAS_HEADERS, 
          startColumn: 333,
          endColumn: 343,
        },
      ]
    },
    {
      _id: '12',
      subSurveyName: 'SRV12',
      description: 'NPI',
      headerParserModificators: [ 
        {
          modificator: SRV_FIRST_ROW_HAS_HEADERS, 
          startColumn: 344,
          endColumn: 344,
        }, 
        {
          modificator: SRV_CONCAT_1STROW_HEADER_2NDROW_HEADER, 
          startColumn: 345,
          endColumn:364,
        },
        {
          modificator: SRV_FIRST_ROW_HAS_HEADERS, 
          startColumn: 365,
          endColumn:365,
        },
        {
          modificator: SRV_CONCAT_1STROW_HEADER_2NDROW_HEADER, 
          startColumn: 366,
          endColumn:385,
        },
        {
          modificator: SRV_FIRST_ROW_HAS_HEADERS, 
          startColumn: 386,
          endColumn:386,
        },
        {
          modificator: SRV_CONCAT_1STROW_HEADER_2NDROW_HEADER, 
          startColumn: 387,
          endColumn:406,
        },
        {
          modificator: SRV_FIRST_ROW_HAS_HEADERS, 
          startColumn: 407,
          endColumn: 415,
        },
        {
          modificator: SRV_SECOND_ROW_HAS_HEADERS, 
          startColumn: 416,
          endColumn: 415,
        },
      ]
    },
    {
      _id: '13',
      subSurveyName: 'SRV13',
      description: 'Indique su grado de acuerdo y desacuerdo en cada una de las siguientes oraciones',
      headerParserModificators: [ 
        {
          modificator: SRV_SECOND_ROW_HAS_HEADERS, 
          startColumn: 416,
          endColumn: 429,
        },
      ]
    },
    {
      _id: '14',
      subSurveyName: 'SRV14',
      description: 'Instrucciones:Por favor indique su grado de acuerdo o desacuerdo con cada una de las siguientes declaraciones marcando la opición apropiada. Para el propósito de este estudio, enfermería se define como “un enfermero(a) registrado quién está ocupado o directamente supervisando el cuidado de pacientes hospitalizados”.',
      headerParserModificators: [ 
        {
          modificator: SRV_SECOND_ROW_HAS_HEADERS, 
          startColumn: 430,
          endColumn: 444,
        },
      ]
    },
    {
      _id: '15',
      subSurveyName: 'SRV15',
      description: 'Instrucciones:Por favor indique su grado de acuerdo o desacuerdo con cada una de las siguientes declaraciones marcando la opición apropiada. Para el propósito de este estudio, enfermería se define como “un enfermero(a) registrado quién está ocupado o directamente supervisando el cuidado de pacientes hospitalizados”.',
      headerParserModificators: [ 
        {
          modificator: SRV_CONCAT_1STROW_HEADER_2NDROW_HEADER, 
          startColumn: 445,
          endColumn: 524,
        },
      ]
    },
]
  }
    
]

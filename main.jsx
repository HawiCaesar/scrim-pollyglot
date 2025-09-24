import OpenAI from 'openai';
import { useState } from 'react';
import parrot from './assets/parrot.png';
import frenchFlag from './assets/fr-flag.png';
import spanishFlag from './assets/sp-flag.png';
import japaneseFlag from './assets/jpn-flag.png';

export const App = () => {
  const [language, setLanguage] = useState('french');
  const [textValue, setTextValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [translatedResponse, setTranslatedResponse] = useState(null);

  const onTranslateUsingAI = async ({ language, textToTranslate }) => {
    setLoading(true);

    const messages = [
      {
        role: 'system',
        content: 'You are multilingual expert translator.'
      },
      {
        role: 'user',
        content: `In this context you are going to help translate text within the ### from english to ${language}. 
            The following needs translation
            
            ###
            ${textToTranslate}
            ###
            `
      }
    ];

    try {
      const openai = new OpenAI({
        dangerouslyAllowBrowser: true,
        apiKey: import.meta.env.VITE_OPENAI_API_KEY
      });
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: messages,
        temperature: 0
      });
      setTranslatedResponse(response.choices[0].message.content);
      setLoading(false);
    } catch (err) {
      console.log('Error:', err);
      //loadingArea.innerText = 'Unable to access AI. Please refresh and try again'
      setLoading(false);
    }
  };

  const onHandleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const onHandleTextToTranslate = (e) => {
    setTextValue(e.target.value);
  };

  const onSubmitTranslateText = async (e) => {
    e.preventDefault();
    await onTranslateUsingAI({ language, textToTranslate: textValue });
  };

  const onReset = () => {
    setTranslatedResponse(null);
    setTextValue('');
  };

  return (
    <div className='mb-8'>
      {/** header and logo */}
      <div className='bg-[url(./assets/worldmap.png)] h-[200px] bg-top bg-no-repeat flex justify-center'>
        <div className='text-white flex flex-row'>
          <div className='self-center px-2'>
            <img src={parrot} width='90' height='80' />
          </div>
          <div className='self-center px-2'>
            <p id='appName' className='text-[#32CD32] text-4xl'>
              PollyGlot
            </p>
            <p id='appSubtitle' className='text-xs'>
              Perfect Transition Every Time
            </p>
          </div>
        </div>
      </div>

      {/** where the translation happens*/}
      <form onSubmit={onSubmitTranslateText}>
        <div className='border-4 border-black rounded-xl m-4 px-4 pb-8'>
          <p className='text-center py-4 text-[#035A9D]'>
            Text to translate 👇🏾
          </p>
          <div className='flex justify-center align-center'>
            <textarea
              name='englishText'
              value={textValue}
              onChange={onHandleTextToTranslate}
              rows='5'
              cols='40'
              className='px-4 pt-2 bg-[#EFF0F4] rounded-md'
            ></textarea>
          </div>

          {loading && (
            <p className='text-center py-4 text-[#035A9D]'>
              loading translation ...
            </p>
          )}

          {!loading && !translatedResponse && (
            <>
              <p className='text-center py-4 text-[#035A9D]'>
                Select language 👇🏾
              </p>
              <div className='ml-6 my-2 flex'>
                <input
                  type='radio'
                  id='french'
                  name='language'
                  value='french'
                  checked={language === 'french'}
                  onChange={onHandleLanguageChange}
                />
                <label className='ml-2 mr-2' htmlFor='french'>
                  French
                </label>
                <div className='border border-[#999999]-950 w-[29px] h-[20px]'>
                  <img src={frenchFlag} />
                </div>
              </div>

              <div className='ml-6 my-2 flex'>
                <input
                  type='radio'
                  id='spanish'
                  name='language'
                  value='spanish'
                  checked={language === 'spanish'}
                  onChange={onHandleLanguageChange}
                />
                <label className='ml-2 mr-2' htmlFor='spanish'>
                  Spanish
                </label>
                <div className='border border-[#999999]-950 w-[29px] h-[20px]'>
                  <img src={spanishFlag} width='30' height='20' />
                </div>
              </div>

              <div className='ml-6 my-2 flex'>
                <input
                  type='radio'
                  id='japanese'
                  name='language'
                  value='japanese'
                  checked={language === 'japanese'}
                  onChange={onHandleLanguageChange}
                />
                <label className='ml-2 mr-2' htmlFor='japanese'>
                  Japanese
                </label>
                <div className='border border-[#999999]-950 w-[29px] h-[20px]'>
                  <img src={japaneseFlag} width='30' height='20' />
                </div>
              </div>
              <div className='flex justify-center align-center mt-6'>
                <button
                  className='h-[50px] w-[300px] rounded-md text-white bg-[#035A9D]'
                  type='submit'
                >
                  Translate
                </button>
              </div>
            </>
          )}

          {translatedResponse && (
            <>
              <p className='text-center py-4 text-[#035A9D]'>
                Your translation
              </p>
              <div className='flex justify-center align-center'>
                <textarea
                  disabled
                  name='translatedValue'
                  value={translatedResponse}
                  rows='5'
                  cols='40'
                  className='pl-4 pt-2 bg-[#EFF0F4] rounded-md'
                ></textarea>
              </div>
              <div className='flex justify-center align-center mt-6'>
                <button
                  className='h-[50px] w-[300px] rounded-md text-white bg-[#035A9D]'
                  type='button'
                  onClick={onReset}
                >
                  Start Over
                </button>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

import OpenAI from 'openai';
import { useState } from 'react';
import parrot from './assets/parrot.png';
import frenchFlag from './assets/new_fr.png';
import spanishFlag from './assets/new_sp.png';
import japaneseFlag from './assets/new_jpn.png';
import sendIcon from './assets/send-btn.svg';

export const App = () => {
  const [language, setLanguage] = useState('french');
  const [textValue, setTextValue] = useState('');
  const [loading, setLoading] = useState(false);

  const onTranslateUsingAI = async ({ language, textToTranslate }) => {
    setLoading(true);

    const messages = [
      {
        role: 'system',
        content: 'You are multilingual expert translator.'
      },
      {
        role: 'user',
        content: `In this context you are going to help translate text in beetwen ### only from english to ${language}. The following needs translation ### ${textToTranslate} ###. The translation should not include the instructions or the ###`
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
      addTranslationToDiv(response.choices[0].message.content);
      setLoading(false);
    } catch (err) {
      //loadingArea.innerText = 'Unable to access AI. Please refresh and try again'
      document.querySelector('#loading-translation').remove();
      addErrorToDiv(err.message);
      setLoading(false);
    }
  };

  const onHandleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const onHandleTextToTranslate = (e) => {
    setTextValue(e.target.value);
  };

  const addErrorToDiv = (text) => {
    const div = document.createElement('div');
    div.innerHTML = `~~~ ERROR: Something went wrong while translating. Please refresh and try again. ${text} ~~~`;
    div.className = 'text-white border border-[#BE123C] bg-[#BE123C] rounded-tl-xl rounded-bl-xl rounded-br-xl m-4 px-4 pt-2 pb-8';
    div.id = 'error-text-div';
    document.querySelector('#user-text-div').appendChild(div);
  };

  const addUserTextToDiv = (text) => {
    const div = document.createElement('div');
    div.innerHTML = text;
    div.className = 'border border-[#65DA65] bg-[#65DA65] rounded-tr-xl rounded-bl-xl rounded-br-xl m-4 px-4 pt-2 pb-8';
    document.querySelector('#user-text-div').appendChild(div);

    const div2 = document.createElement('div');
    div2.innerHTML = 'Loading translation...';
    div2.className = 'text-black mx-8';
    div2.id = 'loading-translation';
    document.querySelector('#user-text-div').appendChild(div2);
  };

  const addTranslationToDiv = (text) => {
    document.querySelector('#loading-translation').remove();

    const div = document.createElement('div');
    div.innerHTML = text;
    div.className = 'text-white border border-[#035A9D] bg-[#035A9D] rounded-tl-xl rounded-bl-xl rounded-br-xl m-4 px-4 pt-2 pb-8';
    div.id = 'translated-text-div';
    document.querySelector('#user-text-div').appendChild(div);
  };

  const onSubmitTranslateText = async (e) => {
    e.preventDefault();
    setTextValue('');

    //place text entered to div right under
    addUserTextToDiv(textValue);
   await onTranslateUsingAI({ language, textToTranslate: textValue });
  };

  return (
    <div className='mb-8'>
      {/** header and logo */}
      <div className='bg-[url("./assets/worldmap.png")] h-[200px] bg-top bg-no-repeat flex justify-center'>
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
          <div className='mt-4 pb-8 overflow-y-scroll h-[400px]'>
          {/** instructions */}
            <div className='border border-[#035A9D] rounded-tl-xl rounded-bl-xl rounded-br-xl m-4 px-4 pt-2 pb-8 bg-[#035A9D] text-white'>
              Select the language you want me to translate into, type your text
              and hit send!
            </div>
            <div id='user-text-div'>

            </div>
          </div>
          <div className='mt-4'>
            <div className='flex items-center m-4 bg-[#EFF0F4] rounded-md'>
              <textarea
                name='englishText'
                value={textValue}
                onChange={onHandleTextToTranslate}
                rows='2'
                className='flex-1 px-4 pt-2 pb-2 bg-transparent resize-none focus:outline-none border-none'
                placeholder='Type your text here...'
              />
              <button
                type='submit'
                className='p-2 mr-2 cursor-pointer hover:bg-gray-200 rounded transition-colors flex-shrink-0'
                disabled={!textValue.trim() || loading}
              >
                <img
                  src={sendIcon}
                  alt='Send'
                  className={`w-6 h-6 ${
                    !textValue.trim() || loading ? 'opacity-50' : 'opacity-100'
                  }`}
                />
              </button>
            </div>
          </div>

          {/** language selection */}
          <div className='m-4 px-4 pb-2 flex flex-row justify-center'>
            <div className='ml-6 my-2 flex'>
              <input
                type='radio'
                id='french'
                name='language'
                value='french'
                checked={language === 'french'}
                onChange={onHandleLanguageChange}
                className='sr-only'
              />
              <label className='ml-2 mr-2' htmlFor='french'>
                <div
                  className={`${
                    language === 'french'
                      ? 'border-2 border-[#035A9D]'
                      : 'border border-[#999999]-950'
                  }`}
                >
                  <img src={frenchFlag} width='48' height='32' />
                </div>
              </label>
            </div>

            <div className='ml-6 my-2 flex'>
              <input
                type='radio'
                id='spanish'
                name='language'
                value='spanish'
                checked={language === 'spanish'}
                onChange={onHandleLanguageChange}
                className='sr-only'
              />
              <label className='ml-2 mr-2' htmlFor='spanish'>
                <div
                  className={`${
                    language === 'spanish'
                      ? 'border-2 border-[#035A9D]'
                      : 'border border-[#999999]-950'
                  }`}
                >
                  <img src={spanishFlag} width='48' height='32' />
                </div>
              </label>
            </div>

            <div className='ml-6 my-2 flex'>
              <input
                type='radio'
                id='japanese'
                name='language'
                value='japanese'
                checked={language === 'japanese'}
                onChange={onHandleLanguageChange}
                className='sr-only'
              />
              <label className='ml-2 mr-2' htmlFor='japanese'>
                <div
                  className={`${
                    language === 'japanese'
                      ? 'border-2 border-[#035A9D]'
                      : 'border border-[#999999]-950'
                  }`}
                >
                  <img src={japaneseFlag} width='48' height='32' />
                </div>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/config'


const Register = () => {
  // 不建議這樣寫，參數太多會漏改
  // const [email, setEmail] = useState('');
  // const [name, setName] = useState('');

  // 建議這種寫法,為方便開發檢查用，先給預設值
  const [member, setMember] = useState({
    email: 'siangjyun0926@gmail.com',
    name: 'siang',
    password: 'test8888',
    confirmPassword: 'test8888',
    photo: '',
  });

  function handleChange(e) {
    // member.email = e.target.value;  (x) 這是錯誤寫法
    // 在 react 不可以直接去修改原本的 state 記憶體，
    // 要做一塊新的記憶體，並透過 setXXX 去修改，如下:
    setMember({ ...member, [e.target.name]: e.target.value });
  }

  function handlePhoto(e) {
    setMember({ ...member, photo: e.target.files[0] });
  }

  async function handleSubmit(e) {
    // 停掉預設行為
    e.preventDefault();
    try {
      // axios.get(URL, params)
      // axios.post(URL, data, params)
      // 方法1: 當你的表單沒有圖片的時候，可以直接傳輸 json 到後端去
      // let response = await axios.post(`${API_URL}/auth/register`, member);
      // console.log(response.data);

      // 方法2: 如果表單有圖片，會用 FormData 的方式來上傳
      let formData = new FormData();
      formData.append('email', member.email);
      formData.append('name', member.name);
      formData.append('password', member.password);
      formData.append('confirmPassword', member.confirmPassword);
      formData.append('photo', member.photo);
      let response = axios.post(`${API_URL}/auth/register`, formData);
      console.log(response.data);

    } catch (e) {
      console.error(e);
    }
  }

  return (
    <form className="bg-purple-100 h-screen md:h-full md:my-20 md:mx-16 lg:mx-28 xl:mx-40 py-16 md:py-8 px-24 text-gray-800 md:shadow md:rounded flex flex-col md:justify-center">
      <h2 className="flex justify-center text-3xl mb-6 border-b-2 pb-2 border-gray-300">註冊帳戶</h2>
      <div className="mb-4 text-2xl">
        <label htmlFor="name" className="flex mb-2 w-32">
          Email
        </label>
        <input
          className="w-full border-2 border-purple-200 rounded-md h-10  focus:outline-none focus:border-purple-400 px-2"
          type="text"
          id="email"
          name="email"
          value={member.email}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4 text-2xl">
        <label htmlFor="name" className="flex mb-2 w-32">
          姓名
        </label>
        <input
          className="w-full border-2 border-purple-200 rounded-md h-10 focus:outline-none focus:border-purple-400 px-2"
          type="text"
          id="name"
          name="name"
          value={member.name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4 text-2xl">
        <label htmlFor="password" className="flex mb-2 w-16">
          密碼
        </label>
        <input
          className="w-full border-2 border-purple-200 rounded-md h-10 focus:outline-none focus:border-purple-400 px-2"
          type="password"
          id="password"
          name="password"
          value={member.password}
          onChange={handleChange}
        />
      </div>
      <div className="mb-8 text-2xl">
        <label htmlFor="password" className="flex mb-2 w-32">
          確認密碼
        </label>
        <input
          className="w-full border-2 border-purple-200 rounded-md h-10 focus:outline-none focus:border-purple-400 px-2"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={member.confirmPassword}
          onChange={handleChange}
        />
      </div>
      <div className="mb-8 text-2xl">
        <label htmlFor="photo" className="flex mb-2 w-32">
          圖片
        </label>
        <input
          className="w-full border-2 border-purple-200 rounded-md h-10 focus:outline-none focus:border-purple-400 px-2"
          type="file"
          id="photo"
          name="photo"
          onChange={handlePhoto} />
      </div>
      <button
        className="text-xl bg-indigo-300 px-4 py-2.5 rounded hover:bg-indigo-400 transition duration-200 ease-in"
        onClick={handleSubmit}>
        註冊
      </button>
    </form>
  );
};

export default Register;

import { DevTool } from "@hookform/devtools";
import { FieldErrors, useForm } from "react-hook-form";

type FormValues = {
  username: string,
  email: string,
  channel: string,
  social: {
    twitter: string,
    facebook: string
  }
  phone: string[],
  age: number,
  gender: string,
  cars: string
}

const YoutubeForm = () => {

  // https://codesandbox.io/p/sandbox/reacthookformuseformcontext-l97pb?file=%2Fsrc%2FApp.js%3A12%2C20

  const form = useForm<FormValues>({
    defaultValues: {
      username: '',
      email: '',
      channel: '',
      social: {
        twitter: '',
        facebook: ''
      },
      phone: ["", ""],
      age: 0,
      gender: '',
      cars: ''
    },
    mode: "onSubmit" // onBlur, onChange, all
  });
  const { register, control, handleSubmit, formState, watch, getValues, setValue, reset, trigger } = form;
  const { errors, touchedFields, dirtyFields, isDirty, isValid, isSubmitting, isSubmitted, isSubmitSuccessful} = formState

  // const {name, ref, onChange, onBlur} = register("username");

  // console.log("Form State", touchedFields, dirtyFields, isDirty, isValid, isSubmitting, isSubmitted, isSubmitSuccessful);

  const watchUsername = watch("username"); // watch username only
  const watchAllValues = watch(); // watch all values

  function onSubmit(data: FormValues) {
    console.log("Form submitted", data);
  }

  function handleGetValues() {
    console.log("Get Values", getValues()); //get all values
    console.log("Get Values", getValues(["username", "channel"])); // get specific values
  }

  function handleSetValues() {
    console.log("Set value", setValue("username", "" , {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    }))
  }

  function onError(errors: FieldErrors<FormValues>) {
    console.log("form errors", errors);
  }

  return (
    <div className="form-wrapper">
      <h2>Watch value: {watchUsername}</h2>
      <form onSubmit={handleSubmit(onSubmit, onError)}>

        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" {...register("username", {
            required: "Username is required"
          })} />
          <p>{errors.username?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email"  {...register("email", {
            pattern: {
              value: /^[a-zA-Z0-9.!#$%]/,
              message: 'Invalid email format'
            },
            validate: {
              notAdmin: (fieldValue) => {
                return (
                fieldValue !== 'admin@example.com' || "Enter a different email address"
                )
              },
              notBlackListed: (fieldValue) => {
                return !fieldValue.endsWith("baddomain.com") || "This domain is not supported"
              },
              emailAvailable: async (fieldValue) => {
                const response = await fetch(`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`);
                const data = await response.json();
                return data.length === 0 || "Email already exists"
              }
          }
          })}/>
          <p>{errors.email?.message}</p>
        </div>
        
        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input type="text" id="channel" {...register("channel",{
            required: "Channel is required"
          })}/>
        <p>{errors.channel?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="twitter">Twitter</label>
          <input type="text" id="twitter" {...register("social.twitter", {
            disabled: watch("channel") === ''
          })}/>
        </div>

        <div className="form-control">
          <label htmlFor="facebook">Facebook</label>
          <input type="text" id="facebook" {...register("social.facebook")}/>
        </div>

        <div className="form-control">
          <label htmlFor="phone">Phone Primary</label>
          <input type="text" id="phone" {...register("phone.0")}/>
        </div>

        <div className="form-control">
          <label htmlFor="phone">Phone Secondary</label>
          <input type="text" id="phone" {...register("phone.1")}/>
        </div>

        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input type="text" id="age" {...register("age",{
            valueAsNumber: true,
            required: "Age is required"
          })}/>
        <p>{errors.age?.message}</p>
        </div>

      <div className="form-control">
        <input type="radio" id="male" value="male" {...register("gender")}/>
        <label htmlFor="huey">Male</label>
      </div>
      <div className="form-control">
        <input type="radio" id="female" value="female" {...register("gender")}/>
        <label htmlFor="female">Female</label>
      </div>

      <div className="form-control">
      <label htmlFor="cars">Choose a car:</label>
      <select id="cars" {...register("cars")}>
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
      </select>
      </div>

        {/* <button type="submit" disabled={!isValid || !isDirty}>Submit</button> */}
        <button type="submit">Submit</button>
      </form>
        <button onClick={handleGetValues}>Get values</button>
        <button onClick={handleSetValues}>Set value</button>
      <DevTool control={control } />
    </div>
  );
};

export default YoutubeForm;

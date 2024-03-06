import Button from "@/components/UI/Button";
import { Loader } from "@/components/UI/loader";
import NotificationContext from "@/context/notification";
import useHttp from "@/hooks/use-Http";
import { useInput } from "@/hooks/use-Input";
import useSession from "@/hooks/use-Session";
import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { userSliceActions } from "@/store/userSlice";

import styles from "@/styles/dashboard/profile.module.scss";

const PreferenceForm = () => {
  const { data, status } = useSession();
  const { httpIsLoading, sendRequest } = useHttp();
  const { setNotification } = useContext(NotificationContext);
  const { httpIsLoading: notLoading, sendRequest: sendNotReq } = useHttp();
  const dispatch = useDispatch();
  const { enteredValue: currVal, valueChangeHandler: currHandler } = useInput(
    () => true,
    data.currency
  );
  const { enteredValue: timeZoneVal, valueChangeHandler: timeZoneHandler } =
    useInput(() => true, data.timeZone);
  const [sendCurr, setSendCurr] = useState<boolean>(
    data.notifications.sendCurrency
  );
  const [merchantOrder, setMerchantOrder] = useState<boolean>(
    data.notifications.sendCurrency
  );
  const [recommendations, setRecommendations] = useState<boolean>(
    data.notifications.sendCurrency
  );

  const httpUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formInputs = form.elements;

    const formData: any = {};
    let isValid = true;
    // Iterate through form elements
    for (let i = 0; i < formInputs.length; i++) {
      const input = formInputs[i] as HTMLInputElement;

      // Check if the element is an input or textarea
      if (input.tagName === "INPUT" || input.tagName == "SELECT") {
        if (input.value === "") isValid = false;
        formData[input.name] = input.value;
      }
    }

    if (!isValid) {
      return setNotification({
        message: `Invalid form details`,
        status: "ERROR",
        title: "Error"
      });
    }

    const { error, message, status } = await sendRequest(
      "PUT",
      "user",
      formData,
      "JSON"
    );

    if (error) {
      return setNotification({
        message: `${message}`,
        status: "ERROR",
        title: "Error"
      });
    }

    setNotification({
      message: `${message}`,
      status: "SUCCESS",
      title: "Error"
    });
    dispatch(userSliceActions.updateUserDetails(formData));
  };

  const httpSubmitNots = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      notifications: {
        sendCurrency: sendCurr,
        merchantOrder: merchantOrder,
        recommendations: recommendations
      }
    };

    const { error, message, status } = await sendNotReq(
      "PUT",
      "user",
      formData,
      "JSON"
    );

    if (error) {
      return setNotification({
        message: `${message}`,
        status: "ERROR",
        title: "Error"
      });
    }

    setNotification({
      message: `${message}`,
      status: "SUCCESS",
      title: "Error"
    });
    dispatch(userSliceActions.updateUserDetails(formData));
  };

  return (
    <div className="col-xl-12">
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Preferences</h4>
            </div>
            <div className="card-body">
              <form onSubmit={httpUpdateUser}>
                <div className="form-row">
                  <div
                    className={`${styles.select_input} form-group col-xl-6 col-md-6`}>
                    <label className="mr-sm-2">Local Currency</label>
                    <select
                      className="form-control"
                      name="currency"
                      value={currVal}
                      onChange={currHandler}
                      style={{ backgroundColor: "#000" }}>
                      <option value="USD" selected>
                        USD
                      </option>
                      <option value="GBP">GBP</option>
                      <option value="EUR">EUR</option>
                      <option value="EUR">YEN</option>
                      {/* <option value="RUP">RUP</option>
                      <option value="TRY">TRY</option>
                      <option value="WON">WON</option>
                      <option value="RUB">RUB</option> */}
                    </select>
                  </div>
                  <div
                    className={`${styles.select_input} form-group col-xl-6 col-md-6`}>
                    <label className="mr-sm-2">Time Zone</label>
                    <select
                      name="timeZone"
                      className="form-control"
                      value={timeZoneVal}
                      onChange={timeZoneHandler}
                      style={{ backgroundColor: "#000" }}>
                      <option>(GMT-12:00) International Date Line West</option>
                      <option>(GMT-11:00) Midway Island, Samoa</option>
                      <option>(GMT-10:00) Hawaii</option>
                      <option>(GMT-09:00) Alaska</option>
                      <option>
                        (GMT-08:00) Pacific Time (US &amp; Canada)
                      </option>
                      <option>(GMT-08:00) Tijuana, Baja California</option>
                      <option>GMT-07:00) Arizona</option>
                      <option>(GMT-07:00) Chihuahua, La Paz, Mazatlan</option>
                      <option>
                        (GMT-07:00) Mountain Time (US &amp; Canada)
                      </option>
                      <option>GMT-06:00) Central America</option>
                      <option>
                        (GMT-06:00) Central Time (US &amp; Canada)
                      </option>
                      <option>
                        (GMT-06:00) Guadalajara, Mexico City, Monterrey
                      </option>
                      <option>GMT-06:00) Saskatchewan</option>
                      <option>
                        GMT-05:00) Bogota, Lima, Quito, Rio Branco
                      </option>
                      <option>
                        (GMT-05:00) Eastern Time (US &amp; Canada)
                      </option>
                      <option>(GMT-05:00) Indiana (East)</option>
                      <option>(GMT-04:00) Atlantic Time (Canada)</option>
                      <option>GMT-04:00) Caracas, La Paz</option>
                      <option>GMT-04:00) Manaus</option>
                      <option>(GMT-04:00) Santiago</option>
                      <option>&gt;(GMT-03:30) Newfoundland</option>
                      <option>(GMT-03:00) Brasilia</option>
                      <option>GMT-03:00) Buenos Aires, Georgetown</option>
                      <option>(GMT-03:00) Greenland</option>
                      <option>(GMT-03:00) Montevideo</option>
                      <option>(GMT-02:00) Mid-Atlantic</option>
                      <option>GMT-01:00) Cape Verde Is.</option>
                      <option>(GMT-01:00) Azores</option>
                      <option>MT+00:00) Casablanca, Monrovia, Reykjavik</option>
                      <option>
                        GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh,
                        Lisbon, London
                      </option>
                      <option>
                        GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm,
                        Vienna
                      </option>
                      <option>
                        GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana,
                        Prague
                      </option>
                      <option>
                        GMT+01:00) Brussels, Copenhagen, Madrid, Paris
                      </option>
                      <option>
                        GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb
                      </option>
                      <option>GMT+01:00) West Central Africa</option>
                      <option>GMT+02:00) Amman</option>
                      <option>GMT+02:00) Athens, Bucharest, Istanbul</option>
                      <option>GMT+02:00) Beirut</option>
                      <option>GMT+02:00) Cairo</option>
                      <option>MT+02:00) Harare, Pretoria</option>
                      <option>
                        GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius
                      </option>
                      <option>GMT+02:00) Jerusalem</option>
                      <option>GMT+02:00) Minsk</option>
                      <option>GMT+02:00) Windhoek</option>
                      <option>MT+03:00) Kuwait, Riyadh, Baghdad</option>
                      <option>
                        GMT+03:00) Moscow, St. Petersburg, Volgograd
                      </option>
                      <option>MT+03:00) Nairobi</option>
                      <option>MT+03:00) Tbilisi</option>
                      <option>&gt;(GMT+03:30) Tehran</option>
                      <option>MT+04:00) Abu Dhabi, Muscat</option>
                      <option>GMT+04:00) Baku</option>
                      <option>GMT+04:00) Yerevan</option>
                      <option>(GMT+04:30) Kabul</option>
                      <option>GMT+05:00) Yekaterinburg</option>
                      <option>MT+05:00) Islamabad, Karachi, Tashkent</option>
                      <option>(GMT+05:30) Sri Jayawardenapura</option>
                      <option>
                        (GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi
                      </option>
                      <option>&gt;(GMT+05:45) Kathmandu</option>
                      <option>GMT+06:00) Almaty, Novosibirsk</option>
                      <option>MT+06:00) Astana, Dhaka</option>
                      <option>(GMT+06:30) Yangon (Rangoon)</option>
                      <option>MT+07:00) Bangkok, Hanoi, Jakarta</option>
                      <option>GMT+07:00) Krasnoyarsk</option>
                      <option>
                        MT+08:00) Beijing, Chongqing, Hong Kong, Urumqi
                      </option>
                      <option>MT+08:00) Kuala Lumpur, Singapore</option>
                      <option>MT+08:00) Irkutsk, Ulaan Bataar</option>
                      <option>MT+08:00) Perth</option>
                      <option>MT+08:00) Taipei</option>
                      <option>MT+09:00) Osaka, Sapporo, Tokyo</option>
                      <option>MT+09:00) Seoul</option>
                      <option>GMT+09:00) Yakutsk</option>
                      <option>(GMT+09:30) Adelaide</option>
                      <option>(GMT+09:30) Darwin</option>
                      <option>GMT+10:00) Brisbane</option>
                      <option>(GMT+10:00) Canberra, Melbourne, Sydney</option>
                      <option>(GMT+10:00) Hobart</option>
                      <option>GMT+10:00) Guam, Port Moresby</option>
                      <option>(GMT+10:00) Vladivostok</option>
                      <option>
                        (GMT+11:00) Magadan, Solomon Is., New Caledonia
                      </option>
                      <option>(GMT+12:00) Auckland, Wellington</option>
                      <option>GMT+12:00) Fiji, Kamchatka, Marshall Is.</option>
                      <option>GMT+13:00) Nuku&apos;alofa</option>
                    </select>
                  </div>

                  <div
                    style={{ marginTop: "2.3rem" }}
                    className="form-group col-12">
                    <Button
                      showLoader={httpIsLoading}
                      className={styles.proceed_btn}
                      type="submit">
                      Save
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Notifications</h4>
            </div>
            <div className="card-body">
              <form onSubmit={httpSubmitNots}>
                <div className="form-group mb-0">
                  <label className="toggle">
                    <input
                      className="toggle-checkbox"
                      type="checkbox"
                      checked={sendCurr}
                      onChange={() => {
                        setSendCurr(!sendCurr);
                      }}
                    />
                    <span className="toggle-switch"></span>
                    <span className="toggle-label">
                      I send or receive digital currency
                    </span>
                  </label>
                  <label className="toggle">
                    <input
                      className="toggle-checkbox"
                      type="checkbox"
                      checked={merchantOrder}
                      onChange={() => {
                        setMerchantOrder(!merchantOrder);
                      }}
                    />
                    <span className="toggle-switch"></span>
                    <span className="toggle-label">
                      I receive merchant order
                    </span>
                  </label>
                  <label className="toggle">
                    <input
                      className="toggle-checkbox"
                      type="checkbox"
                      checked={recommendations}
                      onChange={() => {
                        setRecommendations(!recommendations);
                      }}
                    />
                    <span className="toggle-switch"></span>
                    <span className="toggle-label">
                      There are recommendations for my account
                    </span>
                  </label>
                </div>

                <Button
                  showLoader={notLoading}
                  className={styles.proceed_btn}
                  type="submit">
                  Save
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferenceForm;

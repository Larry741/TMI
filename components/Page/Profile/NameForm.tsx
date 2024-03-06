import Button from "@/components/UI/Button";
import { Loader } from "@/components/UI/loader";
import NotificationContext from "@/context/notification";
import { avatar } from "@/helpers/image-imports";
import useHttp from "@/hooks/use-Http";
import { useInput } from "@/hooks/use-Input";
import useSession from "@/hooks/use-Session";
import Image from "next/image";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { userSliceActions } from "@/store/userSlice";

import styles from "@/styles/dashboard/profile.module.scss";

const NameForm = () => {
	const { data } = useSession();
	const { setNotification } = useContext(NotificationContext);
	const { httpIsLoading, sendRequest } = useHttp();
	const dispatch = useDispatch();
	const { enteredValue: fNameVal, valueChangeHandler: fNameHandler } = useInput(
		() => true,
		data.firstName as string
	);
	const { enteredValue: lNameVal, valueChangeHandler: lNameHandler } = useInput(
		() => true,
		data.lastName as string
	);
	const { enteredValue: countryVal, valueChangeHandler: countryHandler } =
		useInput(() => true, data.country as string);
	const { enteredValue: addressVal, valueChangeHandler: addressHandler } =
		useInput(() => true, data.address as string);
	const { enteredValue: phoneVal, valueChangeHandler: phoneHandler } = useInput(
		() => true,
		data.phone as string
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
			if (input.tagName === "INPUT" || input.tagName === "SELECT") {
				if (input.value === "" && input.name != "ci_csrf_token")
					isValid = false;

				if (input.name === "email") continue;
				formData[input.name] = input.value;
			}
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
				title: "Error",
			});
		}

		setNotification({
			message: `${message}`,
			status: "SUCCESS",
			title: "Success",
		});
		dispatch(userSliceActions.updateUserDetails(formData));
	};

	return (
		<div className="col-xl-12">
			<div className="row">
				<div className="col-xl-6 col-md-6">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">User Profile</h4>
						</div>
						<div className="card-body">
							<form>
								<div className="form-row">
									<div className="form-group col-xl-12">
										<div className="media align-items-center mb-3">
											<Image
												style={{ borderRadius: "50%", background: "#606B8A" }}
												src={data?.avatar ?? avatar}
												alt=""
												width={50}
												height={50}
												className="mr-3 rounded-circle mr-0 mr-sm-3"
											/>

											<div className="media-body">
												<h5
													style={{ textTransform: "capitalize" }}
													className={`size_16 mb-0`}>
													{data.firstName} {data.lastName}
												</h5>
												<p className={`${styles.email_color} size_14 mb-0`}>
													{data.email}
												</p>
											</div>
										</div>

										<ul className="card-profile__info">
											<li>
												<div className="input-group mb-3">
													<input
														type="text"
														style={{
															fontSize: "12px",
															backgroundColor: "#000",
														}}
														id="input-copy"
														readOnly
														className="form-control"
														value={`${process.env.NEXT_PUBLIC_APP_URL}/auth/register?ref=${data.email}`}
													/>
													<div
														className={`${styles.ref_link} input-group-append`}>
														<button
															type="button"
															onClick={() => {
																const input = document.getElementById(
																	"input-copy"
																) as HTMLInputElement;
																navigator.clipboard.writeText(input.value);
																setNotification({
																	message: `Referral link to your clipboard`,
																	status: "SUCCESS",
																	title: "Success",
																});
															}}
															className="btn size_14 btn-primary"
															style={{ color: "white" }}>
															Copy Link
														</button>
													</div>
												</div>
											</li>
										</ul>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>

				<div className="col-xl-12">
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">Personal Information</h4>
						</div>
						<div className="card-body">
							<form
								onSubmit={httpUpdateUser}
								role="form"
								className="personal_validate">
								<div className="form-row">
									<div className="form-group col-xl-6 col-md-6">
										<label className="mr-sm-2">First Name</label>
										<input
											type="text"
											className="form-control"
											name="firstName"
											id=""
											onChange={fNameHandler}
											value={fNameVal}
											required
										/>
									</div>
									<div className="form-group col-xl-6 col-md-6">
										<label className="mr-sm-2">Last Name</label>
										<input
											type="text"
											className="form-control"
											name="lastName"
											id=""
											onChange={lNameHandler}
											value={lNameVal}
											required
										/>
									</div>
									<div className="form-group col-xl-6 col-md-6">
										<label className="mr-sm-2">Email</label>
										<input
											type="email"
											style={{ backgroundColor: "#000" }}
											className="form-control"
											name="email"
											id=""
											value={data.email as string}
											required
											readOnly
										/>
									</div>
									<div
										className={`${styles.select_input} form-group col-xl-6 col-md-6`}>
										<label className="mr-sm-2">Country</label>
										<select
											onChange={countryHandler}
											value={countryVal}
											style={{ backgroundColor: "#000" }}
											name="country"
											className="size_16"
											required>
											<option value="United States">United States</option>
											<option value="United Kingdom">United Kingdom</option>
											<option value="Afghanistan">Afghanistan</option>
											<option value="Albania">Albania</option>
											<option value="Algeria">Algeria</option>
											<option value="American Samoa">American Samoa</option>
											<option value="Andorra">Andorra</option>
											<option value="Angola">Angola</option>
											<option value="Anguilla">Anguilla</option>
											<option value="Antarctica">Antarctica</option>
											<option value="Antigua and Barbuda">
												Antigua and Barbuda
											</option>
											<option value="Argentina">Argentina</option>
											<option value="Armenia">Armenia</option>
											<option value="Aruba">Aruba</option>
											<option value="Australia">Australia</option>
											<option value="Austria">Austria</option>
											<option value="Azerbaijan">Azerbaijan</option>
											<option value="Bahamas">Bahamas</option>
											<option value="Bahrain">Bahrain</option>
											<option value="Bangladesh">Bangladesh</option>
											<option value="Barbados">Barbados</option>
											<option value="Belarus">Belarus</option>
											<option value="Belgium">Belgium</option>
											<option value="Belize">Belize</option>
											<option value="Benin">Benin</option>
											<option value="Bermuda">Bermuda</option>
											<option value="Bhutan">Bhutan</option>
											<option value="Bolivia">Bolivia</option>
											<option value="Bosnia and Herzegovina">
												Bosnia and Herzegovina
											</option>
											<option value="Botswana">Botswana</option>
											<option value="Bouvet Island">Bouvet Island</option>
											<option value="Brazil">Brazil</option>
											<option value="British Indian Ocean Territory">
												British Indian Ocean Territory
											</option>
											<option value="Brunei Darussalam">
												Brunei Darussalam
											</option>
											<option value="Bulgaria">Bulgaria</option>
											<option value="Burkina Faso">Burkina Faso</option>
											<option value="Burundi">Burundi</option>
											<option value="Cambodia">Cambodia</option>
											<option value="Cameroon">Cameroon</option>
											<option value="Canada">Canada</option>
											<option value="Cape Verde">Cape Verde</option>
											<option value="Cayman Islands">Cayman Islands</option>
											<option value="Central African Republic">
												Central African Republic
											</option>
											<option value="Chad">Chad</option>
											<option value="Chile">Chile</option>
											<option value="China">China</option>
											<option value="Christmas Island">Christmas Island</option>
											<option value="Cocos (Keeling) Islands">
												Cocos (Keeling) Islands
											</option>
											<option value="Colombia">Colombia</option>
											<option value="Comoros">Comoros</option>
											<option value="Congo">Congo</option>
											<option value="Congo, The Democratic Republic of The">
												Congo, The Democratic Republic of The
											</option>
											<option value="Cook Islands">Cook Islands</option>
											<option value="Costa Rica">Costa Rica</option>
											<option value="Cote D'ivoire">Cote D&apos;ivoire</option>
											<option value="Croatia">Croatia</option>
											<option value="Cuba">Cuba</option>
											<option value="Cyprus">Cyprus</option>
											<option value="Czech Republic">Czech Republic</option>
											<option value="Denmark">Denmark</option>
											<option value="Djibouti">Djibouti</option>
											<option value="Dominica">Dominica</option>
											<option value="Dominican Republic">
												Dominican Republic
											</option>
											<option value="Ecuador">Ecuador</option>
											<option value="Egypt">Egypt</option>
											<option value="El Salvador">El Salvador</option>
											<option value="Equatorial Guinea">
												Equatorial Guinea
											</option>
											<option value="Eritrea">Eritrea</option>
											<option value="Estonia">Estonia</option>
											<option value="Ethiopia">Ethiopia</option>
											<option value="Falkland Islands (Malvinas)">
												Falkland Islands (Malvinas)
											</option>
											<option value="Faroe Islands">Faroe Islands</option>
											<option value="Fiji">Fiji</option>
											<option value="Finland">Finland</option>
											<option value="France">France</option>
											<option value="French Guiana">French Guiana</option>
											<option value="French Polynesia">French Polynesia</option>
											<option value="French Southern Territories">
												French Southern Territories
											</option>
											<option value="Gabon">Gabon</option>
											<option value="Gambia">Gambia</option>
											<option value="Georgia">Georgia</option>
											<option value="Germany">Germany</option>
											<option value="Ghana">Ghana</option>
											<option value="Gibraltar">Gibraltar</option>
											<option value="Greece">Greece</option>
											<option value="Greenland">Greenland</option>
											<option value="Grenada">Grenada</option>
											<option value="Guadeloupe">Guadeloupe</option>
											<option value="Guam">Guam</option>
											<option value="Guatemala">Guatemala</option>
											<option value="Guinea">Guinea</option>
											<option value="Guinea-bissau">Guinea-bissau</option>
											<option value="Guyana">Guyana</option>
											<option value="Haiti">Haiti</option>
											<option value="Heard Island and Mcdonald Islands">
												Heard Island and Mcdonald Islands
											</option>
											<option value="Holy See (Vatican City State)">
												Holy See (Vatican City State)
											</option>
											<option value="Honduras">Honduras</option>
											<option value="Hong Kong">Hong Kong</option>
											<option value="Hungary">Hungary</option>
											<option value="Iceland">Iceland</option>
											<option value="India">India</option>
											<option value="Indonesia">Indonesia</option>
											<option value="Iran, Islamic Republic of">
												Iran, Islamic Republic of
											</option>
											<option value="Iraq">Iraq</option>
											<option value="Ireland">Ireland</option>
											<option value="Israel">Israel</option>
											<option value="Italy">Italy</option>
											<option value="Jamaica">Jamaica</option>
											<option value="Japan">Japan</option>
											<option value="Jordan">Jordan</option>
											<option value="Kazakhstan">Kazakhstan</option>
											<option value="Kenya">Kenya</option>
											<option value="Kiribati">Kiribati</option>
											<option value="Korea, Democratic People's Republic of">
												Korea, Democratic People&lsquo;s Republic of
											</option>
											<option value="Korea, Republic of">
												Korea, Republic of
											</option>
											<option value="Kuwait">Kuwait</option>
											<option value="Kyrgyzstan">Kyrgyzstan</option>
											<option value="Lao People's Democratic Republic">
												Lao People&lsquo;s Democratic Republic
											</option>
											<option value="Latvia">Latvia</option>
											<option value="Lebanon">Lebanon</option>
											<option value="Lesotho">Lesotho</option>
											<option value="Liberia">Liberia</option>
											<option value="Libyan Arab Jamahiriya">
												Libyan Arab Jamahiriya
											</option>
											<option value="Liechtenstein">Liechtenstein</option>
											<option value="Lithuania">Lithuania</option>
											<option value="Luxembourg">Luxembourg</option>
											<option value="Macao">Macao</option>
											<option value="Macedonia, The Former Yugoslav Republic of">
												Macedonia, The Former Yugoslav Republic of
											</option>
											<option value="Madagascar">Madagascar</option>
											<option value="Malawi">Malawi</option>
											<option value="Malaysia">Malaysia</option>
											<option value="Maldives">Maldives</option>
											<option value="Mali">Mali</option>
											<option value="Malta">Malta</option>
											<option value="Marshall Islands">Marshall Islands</option>
											<option value="Martinique">Martinique</option>
											<option value="Mauritania">Mauritania</option>
											<option value="Mauritius">Mauritius</option>
											<option value="Mayotte">Mayotte</option>
											<option value="Mexico">Mexico</option>
											<option value="Micronesia, Federated States of">
												Micronesia, Federated States of
											</option>
											<option value="Moldova, Republic of">
												Moldova, Republic of
											</option>
											<option value="Monaco">Monaco</option>
											<option value="Mongolia">Mongolia</option>
											<option value="Montserrat">Montserrat</option>
											<option value="Morocco">Morocco</option>
											<option value="Mozambique">Mozambique</option>
											<option value="Myanmar">Myanmar</option>
											<option value="Namibia">Namibia</option>
											<option value="Nauru">Nauru</option>
											<option value="Nepal">Nepal</option>
											<option value="Netherlands">Netherlands</option>
											<option value="Netherlands Antilles">
												Netherlands Antilles
											</option>
											<option value="New Caledonia">New Caledonia</option>
											<option value="New Zealand">New Zealand</option>
											<option value="Nicaragua">Nicaragua</option>
											<option value="Niger">Niger</option>
											<option value="Nigeria">Nigeria</option>
											<option value="Niue">Niue</option>
											<option value="Norfolk Island">Norfolk Island</option>
											<option value="Northern Mariana Islands">
												Northern Mariana Islands
											</option>
											<option value="Norway">Norway</option>
											<option value="Oman">Oman</option>
											<option value="Pakistan">Pakistan</option>
											<option value="Palau">Palau</option>
											<option value="Palestinian Territory, Occupied">
												Palestinian Territory, Occupied
											</option>
											<option value="Panama">Panama</option>
											<option value="Papua New Guinea">Papua New Guinea</option>
											<option value="Paraguay">Paraguay</option>
											<option value="Peru">Peru</option>
											<option value="Philippines">Philippines</option>
											<option value="Pitcairn">Pitcairn</option>
											<option value="Poland">Poland</option>
											<option value="Portugal">Portugal</option>
											<option value="Puerto Rico">Puerto Rico</option>
											<option value="Qatar">Qatar</option>
											<option value="Reunion">Reunion</option>
											<option value="Romania">Romania</option>
											<option value="Russian Federation">
												Russian Federation
											</option>
											<option value="Rwanda">Rwanda</option>
											<option value="Saint Helena">Saint Helena</option>
											<option value="Saint Kitts and Nevis">
												Saint Kitts and Nevis
											</option>
											<option value="Saint Lucia">Saint Lucia</option>
											<option value="Saint Pierre and Miquelon">
												Saint Pierre and Miquelon
											</option>
											<option value="Saint Vincent and The Grenadines">
												Saint Vincent and The Grenadines
											</option>
											<option value="Samoa">Samoa</option>
											<option value="San Marino">San Marino</option>
											<option value="Sao Tome and Principe">
												Sao Tome and Principe
											</option>
											<option value="Saudi Arabia">Saudi Arabia</option>
											<option value="Senegal">Senegal</option>
											<option value="Serbia and Montenegro">
												Serbia and Montenegro
											</option>
											<option value="Seychelles">Seychelles</option>
											<option value="Sierra Leone">Sierra Leone</option>
											<option value="Singapore">Singapore</option>
											<option value="Slovakia">Slovakia</option>
											<option value="Slovenia">Slovenia</option>
											<option value="Solomon Islands">Solomon Islands</option>
											<option value="Somalia">Somalia</option>
											<option value="South Africa">South Africa</option>
											<option value="South Georgia and The South Sandwich Islands">
												South Georgia and The South Sandwich Islands
											</option>
											<option value="Spain">Spain</option>
											<option value="Sri Lanka">Sri Lanka</option>
											<option value="Sudan">Sudan</option>
											<option value="Suriname">Suriname</option>
											<option value="Svalbard and Jan Mayen">
												Svalbard and Jan Mayen
											</option>
											<option value="Swaziland">Swaziland</option>
											<option value="Sweden">Sweden</option>
											<option value="Switzerland">Switzerland</option>
											<option value="Syrian Arab Republic">
												Syrian Arab Republic
											</option>
											<option value="Taiwan, Province of China">
												Taiwan, Province of China
											</option>
											<option value="Tajikistan">Tajikistan</option>
											<option value="Tanzania, United Republic of">
												Tanzania, United Republic of
											</option>
											<option value="Thailand">Thailand</option>
											<option value="Timor-leste">Timor-leste</option>
											<option value="Togo">Togo</option>
											<option value="Tokelau">Tokelau</option>
											<option value="Tonga">Tonga</option>
											<option value="Trinidad and Tobago">
												Trinidad and Tobago
											</option>
											<option value="Tunisia">Tunisia</option>
											<option value="Turkey">Turkey</option>
											<option value="Turkmenistan">Turkmenistan</option>
											<option value="Turks and Caicos Islands">
												Turks and Caicos Islands
											</option>
											<option value="Tuvalu">Tuvalu</option>
											<option value="Uganda">Uganda</option>
											<option value="Ukraine">Ukraine</option>
											<option value="United Arab Emirates">
												United Arab Emirates
											</option>
											<option value="United Kingdom">United Kingdom</option>
											<option value="United States">United States</option>
											<option value="United States Minor Outlying Islands">
												United States Minor Outlying Islands
											</option>
											<option value="Uruguay">Uruguay</option>
											<option value="Uzbekistan">Uzbekistan</option>
											<option value="Vanuatu">Vanuatu</option>
											<option value="Venezuela">Venezuela</option>
											<option value="Viet Nam">Viet Nam</option>
											<option value="Virgin Islands, British">
												Virgin Islands, British
											</option>
											<option value="Virgin Islands, U.S.">
												Virgin Islands, U.S.
											</option>
											<option value="Wallis and Futuna">
												Wallis and Futuna
											</option>
											<option value="Western Sahara">Western Sahara</option>
											<option value="Yemen">Yemen</option>
											<option value="Zambia">Zambia</option>
											<option value="Zimbabwe">Zimbabwe</option>
										</select>
									</div>
									<div className="form-group col-xl-6 col-md-6">
										<label className="mr-sm-2">Address</label>
										<input
											type="text"
											className="form-control"
											name="address"
											onChange={addressHandler}
											value={addressVal}
											required
										/>
									</div>

									<div className="form-group col-xl-6 col-md-6">
										<label className="mr-sm-2">Phone Number</label>
										<input
											type="tel"
											className="form-control"
											name="phone"
											onChange={phoneHandler}
											value={phoneVal}
											required
											placeholder="Phone"
										/>
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
			</div>
		</div>
	);
};

export default NameForm;

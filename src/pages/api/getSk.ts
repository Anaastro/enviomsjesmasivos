import { NextApiRequest, NextApiResponse } from "next";
import { Promise } from "bluebird";
import { extractPhone } from "@/lib/utils/utils";
import firebaseAdmin from "@/lib/utils/firebaseAdmin";
import { adminService } from "@/services/adminService";

const waapiApiKey = process.env.WAAPI_API_KEY as string;
const cheerio = require("cheerio");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { locationCountryCode, locationRegion, pageNumber, userId } = req.body;

	const region = locationRegion.toLowerCase().replace(/ /g, "-");
	const country = locationCountryCode.toLowerCase();

	try {
		const allResults = [] as any[];

		await Promise.map(new Array(Number(pageNumber)), async (el, index) => {
			const pageIndexUrl = `https://${country}.skokka.com/escorts/${region}/?p=${
				index + 1
			}`;

			const currentPage = index + 1;
			const hrefPages = [] as string[];

			const dataFetched = await fetch(pageIndexUrl);
			const dataHtml = await dataFetched.text();

			const $ = cheerio.load(dataHtml);
			const listingItems = $(".item-content");

			listingItems.each((index: string, el: string) => {
				const href = $(el).find("a").attr("href");
				hrefPages.push(href);
			});

			await Promise.each(hrefPages, async (el, index) => {
				const pageFetched = await fetch(el);
				const pageHtml = await pageFetched.text();
				const $ = cheerio.load(pageHtml);
				const whatsAppButton = $("whatsapp-button").attr("button-href");
				let phone = extractPhone(whatsAppButton) as string;

				if (locationCountryCode === "ar" && phone) {
					const instances = (await adminService.getWaapiInstances(
						waapiApiKey
					)) as any;

					const firstInstance = instances?.instances[0];
					const instanceId = firstInstance?.id;

					const fetchedCorrectChatId = await adminService.getCorrectChatId({
						phoneNumber: phone,
						waapiApiKey,
						instanceId,
					});

					if (fetchedCorrectChatId?.status === "success") {
						phone = fetchedCorrectChatId.data.data.numberId.user;
					}
				}

				const pushObject = {
					id: crypto.randomUUID(),
					phone: `+${phone}`,
					name: `Skokka ${locationRegion} ${currentPage} ${index + 1}`,
				};

				allResults.push(pushObject);
			});
		});

		await Promise.each(allResults, async (el) => {
			await firebaseAdmin
				.firestore()
				.collection("contacts")
				.doc(userId)
				.collection("phones")
				.add({
					...el,
					createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
				});
		});

		res.status(200).json({ allResults });
	} catch (error) {
		console.error("Error deleting user:", error);
		res.status(500).json({ success: false, error: "Failed to delete user" });
	}
};

export default handler;
